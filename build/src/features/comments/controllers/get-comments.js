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
const comment_cache_1 = require("../../../shared/services/redis/comment.cache");
const comment_service_1 = require("../../../shared/services/db/comment.service");
const mongoose_1 = __importDefault(require("mongoose"));
const commentCache = new comment_cache_1.CommentCache();
class Get {
    comments(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { postId } = req.params;
            const cachedComments = yield commentCache.getCommentsFromCache(postId);
            const comments = cachedComments.length
                ? cachedComments
                : yield comment_service_1.commentService.getPostComments({ postId: new mongoose_1.default.Types.ObjectId(postId) }, { createdAt: -1 });
            res.status(http_status_codes_1.default.OK).json({ message: 'Post comments', comments });
        });
    }
    commentsNamesFromCache(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { postId } = req.params;
            const cachedCommentsNames = yield commentCache.getCommentsNamesFromCache(postId);
            const commentsNames = cachedCommentsNames.length
                ? cachedCommentsNames
                : yield comment_service_1.commentService.getPostCommentNames({ postId: new mongoose_1.default.Types.ObjectId(postId) }, { createdAt: -1 });
            res.status(http_status_codes_1.default.OK).json({ message: 'Post comments names', comments: commentsNames.length ? commentsNames[0] : [] });
        });
    }
    singleComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { postId, commentId } = req.params;
            const cachedComments = yield commentCache.getSingleCommentFromCache(postId, commentId);
            const comments = cachedComments.length
                ? cachedComments
                : yield comment_service_1.commentService.getPostComments({ _id: new mongoose_1.default.Types.ObjectId(commentId) }, { createdAt: -1 });
            res.status(http_status_codes_1.default.OK).json({ message: 'Single comment', comments: comments.length ? comments[0] : [] });
        });
    }
}
exports.Get = Get;
//# sourceMappingURL=get-comments.js.map