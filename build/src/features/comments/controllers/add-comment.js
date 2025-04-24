"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
exports.Add = void 0;
const express_1 = __importDefault(require("express"));
const mongodb_1 = require("mongodb");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const joi_validation_decorators_1 = require("../../../shared/globals/decorators/joi-validation.decorators");
// import { addCommentSchema } from '../schemes/comment';
const comment_1 = require("../schemes/comment");
const comment_cache_1 = require("../../../shared/services/redis/comment.cache");
const comment_queue_1 = require("../../../shared/services/queues/comment.queue");
const commentCache = new comment_cache_1.CommentCache();
class Add {
    comment(req, res) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const { userTo, postId, profilePicture, comment } = req.body;
            const commentObjectId = new mongodb_1.ObjectId();
            const commentData = {
                _id: commentObjectId,
                postId,
                username: `${(_a = req.currentUser) === null || _a === void 0 ? void 0 : _a.username}`,
                avatarColor: `${(_b = req.currentUser) === null || _b === void 0 ? void 0 : _b.avatarColor}`,
                profilePicture,
                comment,
                createdAt: new Date()
            };
            yield commentCache.savePostCommentToCache(postId, JSON.stringify(commentData));
            const databaseCommentData = {
                postId,
                userTo,
                userFrom: req.currentUser.userId,
                username: req.currentUser.username,
                comment: commentData
            };
            comment_queue_1.commentQueue.addCommentJob('addCommentToDB', databaseCommentData);
            res.status(http_status_codes_1.default.OK).json({ message: 'Comment created successfully' });
        });
    }
}
__decorate([
    (0, joi_validation_decorators_1.joiValidation)(comment_1.addCommentSchema),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Add.prototype, "comment", null);
exports.Add = Add;
//# sourceMappingURL=add-comment.js.map