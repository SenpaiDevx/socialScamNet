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
exports.Remove = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const reaction_cache_1 = require("../../../shared/services/redis/reaction.cache");
const reaction_queue_1 = require("../../../shared/services/queues/reaction.queue");
const reactionCache = new reaction_cache_1.ReactionCache();
class Remove {
    reaction(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { postId, previousReaction, postReactions } = req.params;
            yield reactionCache.removePostReactionFromCache(postId, `${req.currentUser.username}`, JSON.parse(postReactions));
            const databaseReactionData = {
                postId,
                username: req.currentUser.username,
                previousReaction
            };
            reaction_queue_1.reactionQueue.addReactionJob('removeReactionFromDB', databaseReactionData);
            res.status(http_status_codes_1.default.OK).json({ message: 'Reaction removed from post' });
        });
    }
}
exports.Remove = Remove;
//# sourceMappingURL=remove-reaction.js.map