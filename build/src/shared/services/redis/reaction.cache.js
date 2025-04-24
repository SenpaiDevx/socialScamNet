"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactionCache = void 0;
const base_cache_1 = require("../redis/base.cache");
const lodash_1 = require("lodash");
const config_1 = require("../../../config");
const error_handler_1 = require("../../globals/helpers/error-handler");
const helpers_1 = require("../../globals/helpers/helpers");
const log = config_1.config.createLogger('reactionsCache');
class ReactionCache extends base_cache_1.BaseCache {
    constructor() {
        super('reactionsCache');
    }
    savePostReactionToCache(key, reaction, postReactions, type, previousReaction) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!this.client.isOpen) {
                    yield this.client.connect();
                }
                if (previousReaction) {
                    // for remove prev reactions
                    this.removePostReactionFromCache(key, reaction.username, postReactions);
                }
                if (type) {
                    yield this.client.LPUSH(`reactions:${key}`, JSON.stringify(reaction)); // always insert to the start index
                    // const dataToSave: string[] = ['reactions', JSON.stringify(postReactions)]
                    yield this.client.HSET(`posts:${key}`, 'reactions', JSON.stringify(postReactions));
                    ; // overwrite the existing objects ref keys 
                }
                console.log('error log here 1');
            }
            catch (error) {
                log.error(error);
                throw new error_handler_1.ServerError('Server error. Try again. : ' + error);
            }
        });
    }
    removePostReactionFromCache(key, username, postReactions) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!this.client.isOpen) {
                    yield this.client.connect();
                }
                const response = yield this.client.LRANGE(`reactions:${key}`, 0, -1); // get a list of reactions as array of object -> 0 , -1 means all elements
                const multi = this.client.multi();
                const userPreviousReaction = this.getPreviousReaction(response, username);
                multi.LREM(`reactions:${key}`, 1, JSON.stringify(userPreviousReaction)); // remove the user previous reaction from the list of reactions
                // hash key , no of item to remove, element to remove
                yield multi.exec();
                yield this.client.HSET(`posts:${key}`, 'reactions', JSON.stringify(postReactions));
            }
            catch (error) {
            }
        });
    }
    getPreviousReaction(response, username) {
        const list = [];
        console.log(response);
        for (const item of response) {
            list.push(helpers_1.Helpers.parseJson(item));
        }
        return (0, lodash_1.find)(list, (listItem) => {
            return listItem.username === username;
        });
    }
    getReactionsFromCache(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!this.client.isOpen) {
                    yield this.client.connect();
                }
                const reactionsCount = yield this.client.LLEN(`reactions:${postId}`); // get the length of the list
                const response = yield this.client.LRANGE(`reactions:${postId}`, 0, -1);
                const list = [];
                for (const item of response) {
                    list.push(helpers_1.Helpers.parseJson(item));
                }
                return response.length ? [list, reactionsCount] : [[], 0]; // 1st index is the list of reactions , 2nd index is the count of reactions
            }
            catch (error) {
                log.error(error);
                throw new error_handler_1.ServerError('Server error. Try again.');
            }
        });
    }
    getSingleReactionByUsernameFromCache(postId, username) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!this.client.isOpen) {
                    yield this.client.connect();
                }
                const response = yield this.client.LRANGE(`reactions:${postId}`, 0, -1);
                const list = [];
                for (const item of response) {
                    list.push(helpers_1.Helpers.parseJson(item));
                }
                const result = (0, lodash_1.find)(list, (listItem) => {
                    return (listItem === null || listItem === void 0 ? void 0 : listItem.postId) === postId && (listItem === null || listItem === void 0 ? void 0 : listItem.username) === username;
                });
                return result ? [result, 1] : [];
            }
            catch (error) {
                log.error(error);
                throw new error_handler_1.ServerError('Server error. Try again.');
            }
        });
    }
}
exports.ReactionCache = ReactionCache;
//# sourceMappingURL=reaction.cache.js.map