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
exports.Get = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const reaction_cache_1 = require("../../../shared/services/redis/reaction.cache");
const reaction_service_1 = require("../../../shared/services/db/reaction.service");
const mongoose_1 = __importDefault(require("mongoose"));
const reactionCache = new reaction_cache_1.ReactionCache();
class Get {
    reactions(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { postId } = req.params;
            const cachedReactions = yield reactionCache.getReactionsFromCache(postId);
            const reactions = cachedReactions[0].length
                ? cachedReactions
                : yield reaction_service_1.reactionService.getPostReactions({ postId: new mongoose_1.default.Types.ObjectId(postId) }, { createdAt: -1 });
            // const reactions = await reactionService.getPostReactions({ postId: new mongoose.Types.ObjectId(postId) }, { createdAt: -1 });
            res.status(http_status_codes_1.default.OK).json({ message: 'Post reactions', reactions: reactions[0], count: reactions[1] });
        });
    }
    singleReactionByUsername(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { postId, username } = req.params;
            const cachedReaction = yield reactionCache.getSingleReactionByUsernameFromCache(postId, username);
            const reactions = cachedReaction.length
                ? cachedReaction
                : yield reaction_service_1.reactionService.getSinglePostReactionByUsername(postId, username);
            res.status(http_status_codes_1.default.OK).json({
                message: 'Single post reaction by username',
                reactions: reactions.length ? reactions[0] : {},
                count: reactions.length ? reactions[1] : 0
            });
        });
    }
    reactionsByUsername(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username } = req.params;
            const reactions = yield reaction_service_1.reactionService.getReactionsByUsername(username);
            res.status(http_status_codes_1.default.OK).json({ message: 'All user reactions by username', reactions });
        });
    }
}
exports.Get = Get;
//# sourceMappingURL=get-reactions.js.map