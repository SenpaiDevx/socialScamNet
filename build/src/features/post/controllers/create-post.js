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
exports.Create = void 0;
const joi_validation_decorators_1 = require("../../../shared/globals/decorators/joi-validation.decorators");
const post_schemes_1 = require("../schemes/post.schemes");
const express_1 = __importDefault(require("express"));
const mongodb_1 = require("mongodb");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const post_cache_1 = require("../../../shared/services/redis/post.cache");
const post_1 = require("../../../shared/sockets/post");
const post_queue_1 = require("../../../shared/services/queues/post.queue");
const cloudinary_upload_1 = require("../../../shared/globals/helpers/cloudinary-upload");
const error_handler_1 = require("../../../shared/globals/helpers/error-handler");
const image_queue_1 = require("../../../shared/services/queues/image.queue");
const postCache = new post_cache_1.PostCache();
class Create {
    post(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const { post, bgColor, privacy, gifUrl, profilePicture, feelings } = req.body;
            const postObjectId = new mongodb_1.ObjectId();
            const createdPost = {
                _id: postObjectId,
                userId: req.currentUser.userId,
                username: req.currentUser.username,
                email: req.currentUser.email,
                avatarColor: req.currentUser.avatarColor,
                profilePicture,
                post,
                bgColor,
                feelings,
                privacy,
                gifUrl,
                commentsCount: 0,
                imgVersion: '',
                imgId: '',
                videoId: '',
                videoVersion: '',
                createdAt: new Date(),
                reactions: { like: 0, love: 0, happy: 0, sad: 0, wow: 0, angry: 0 }
            };
            // sockets realtime read ECONNRESET
            // await socketIOPostObject.emit('add post', createdPost)  // cause of error unhandle promise/promisefy deprecated
            post_1.socketIOPostObject.on('connection ', (socket) => {
                socket.emit('add post', createdPost);
            });
            console.log('after socket emit');
            // redis cache
            yield postCache.savePostToCache({
                key: postObjectId,
                currentUserId: `${req.currentUser.userId}`,
                uId: `${req.currentUser.uId}`,
                createdPost
            });
            console.log('after redis cache');
            // mongodb database
            yield post_queue_1.postQueue.addPostJob('addPostToDB', { key: (_a = req.currentUser) === null || _a === void 0 ? void 0 : _a.userId, value: createdPost });
            res.status(http_status_codes_1.default.CREATED).json({ message: 'Post created successfully' });
        });
    }
    ;
    postWithImage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { post, bgColor, privacy, gifUrl, profilePicture, feelings, image } = req.body;
            const result = (yield (0, cloudinary_upload_1.uploads)(image));
            if (!(result === null || result === void 0 ? void 0 : result.public_id))
                throw new error_handler_1.BadRequestError(result.message);
            const postObjectId = new mongodb_1.ObjectId();
            const createdPost = {
                _id: postObjectId,
                userId: req.currentUser.userId,
                username: req.currentUser.username,
                email: req.currentUser.email,
                avatarColor: req.currentUser.avatarColor,
                profilePicture,
                post,
                bgColor,
                feelings,
                privacy,
                gifUrl,
                commentsCount: 0,
                imgVersion: result.version.toString(),
                imgId: result.public_id,
                videoId: '',
                videoVersion: '',
                createdAt: new Date(),
                reactions: { like: 0, love: 0, happy: 0, sad: 0, wow: 0, angry: 0 }
            };
            //socket 
            // socketIOPostObject.emit('add post', createdPost); // potenial error an handle promise/promisfy  cause app to be crashed 
            // redis cache and queue
            post_1.socketIOPostObject.on('connection ', (socket) => {
                socket.emit('add post', createdPost);
            });
            yield postCache.savePostToCache({
                key: postObjectId,
                currentUserId: `${req.currentUser.userId}`,
                uId: `${req.currentUser.uId}`,
                createdPost
            });
            // database
            post_queue_1.postQueue.addPostJob('addPostToDB', { key: req.currentUser.userId, value: createdPost });
            image_queue_1.imageQueue.addImageJob('addImageToDB', {
                key: `${req.currentUser.userId}`,
                imgId: result.public_id,
                imgVersion: result.version.toString()
            });
            res.status(http_status_codes_1.default.CREATED).json({ message: 'Post created with image successfully' });
        });
    }
    postWithVideo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { post, bgColor, privacy, gifUrl, profilePicture, feelings, video } = req.body;
            const result = (yield (0, cloudinary_upload_1.videoUpload)(video));
            if (!(result === null || result === void 0 ? void 0 : result.public_id)) {
                throw new error_handler_1.BadRequestError(result.message);
            }
            const postObjectId = new mongodb_1.ObjectId();
            const createdPost = {
                _id: postObjectId,
                userId: req.currentUser.userId,
                username: req.currentUser.username,
                email: req.currentUser.email,
                avatarColor: req.currentUser.avatarColor,
                profilePicture,
                post,
                bgColor,
                feelings,
                privacy,
                gifUrl,
                commentsCount: 0,
                imgVersion: '',
                imgId: '',
                videoId: result.public_id,
                videoVersion: result.version.toString(),
                createdAt: new Date(),
                reactions: { like: 0, love: 0, happy: 0, sad: 0, wow: 0, angry: 0 }
            };
            post_1.socketIOPostObject.emit('add post', createdPost);
            yield postCache.savePostToCache({
                key: postObjectId,
                currentUserId: `${req.currentUser.userId}`,
                uId: `${req.currentUser.uId}`,
                createdPost
            });
            post_queue_1.postQueue.addPostJob('addPostToDB', { key: req.currentUser.userId, value: createdPost });
            res.status(http_status_codes_1.default.CREATED).json({ message: 'Post created with video successfully' });
        });
    }
}
__decorate([
    (0, joi_validation_decorators_1.joiValidation)(post_schemes_1.postSchema),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Create.prototype, "post", null);
__decorate([
    (0, joi_validation_decorators_1.joiValidation)(post_schemes_1.postWithImageSchema),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Create.prototype, "postWithImage", null);
__decorate([
    (0, joi_validation_decorators_1.joiValidation)(post_schemes_1.postWithVideoSchema),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Create.prototype, "postWithVideo", null);
exports.Create = Create;
//# sourceMappingURL=create-post.js.map