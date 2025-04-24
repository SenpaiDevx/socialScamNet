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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowerCache = void 0;
const base_cache_1 = require("../redis/base.cache");
const lodash_1 = require("lodash");
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("../../../config");
const error_handler_1 = require("../../globals/helpers/error-handler");
const user_cache_1 = require("../redis/user.cache");
const helpers_1 = require("../../globals/helpers/helpers");
const log = config_1.config.createLogger('followersCache');
const userCache = new user_cache_1.UserCache();
class FollowerCache extends base_cache_1.BaseCache {
    constructor() {
        super('followersCache');
    }
    saveFollowerToCache(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!this.client.isOpen) {
                    yield this.client.connect();
                }
                yield this.client.LPUSH(key, value);
            }
            catch (error) {
                log.error(error);
                throw new error_handler_1.ServerError('Server error. Try again.');
            }
        });
    }
    removeFollowerFromCache(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!this.client.isOpen) {
                    yield this.client.connect();
                }
                yield this.client.LREM(key, 1, value);
            }
            catch (error) {
                log.error(error);
                throw new error_handler_1.ServerError('Server error. Try again.');
            }
        });
    }
    updateFollowersCountInCache(userId, prop, value) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!this.client.isOpen) {
                    yield this.client.connect();
                }
                yield this.client.HINCRBY(`users:${userId}`, prop, value); // increment a specific field -> value of redis cache 
            }
            catch (error) {
                log.error(error);
                throw new error_handler_1.ServerError('Server error. Try again.');
            }
        });
    }
    getFollowersFromCache(key) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!this.client.isOpen) {
                    yield this.client.connect();
                }
                const response = yield this.client.LRANGE(key, 0, -1);
                const list = [];
                for (const item of response) {
                    const user = (yield userCache.getUserFromCache(item));
                    const data = {
                        _id: new mongoose_1.default.Types.ObjectId(user._id),
                        username: user.username,
                        avatarColor: user.avatarColor,
                        postCount: user.postsCount,
                        followersCount: user.followersCount,
                        followingCount: user.followingCount,
                        profilePicture: user.profilePicture,
                        uId: user.uId,
                        userProfile: user
                    };
                    list.push(data);
                }
                return list;
            }
            catch (error) {
                log.error(error);
                throw new error_handler_1.ServerError('Server error. Try again.');
            }
        });
    }
    updateBlockedUserPropInCache(key, prop, value, type) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!this.client.isOpen) {
                    yield this.client.connect();
                }
                const response = (yield this.client.HGET(`users:${key}`, prop));
                const multi = this.client.multi();
                let blocked = helpers_1.Helpers.parseJson(response);
                if (type === 'block') {
                    blocked = [...blocked, value];
                }
                else {
                    (0, lodash_1.remove)(blocked, (id) => id === value);
                    blocked = [...blocked];
                }
                multi.HSET(`users:${key}`, `${prop}`, JSON.stringify(blocked));
                yield multi.exec();
            }
            catch (error) {
                log.error(error);
                throw new error_handler_1.ServerError('Server error. Try again.');
            }
        });
    }
}
exports.FollowerCache = FollowerCache;
//# sourceMappingURL=follower.cache.js.map