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
exports.Update = void 0;
const express_1 = __importDefault(require("express"));
const post_cache_1 = require("../../../shared/services/redis/post.cache");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const post_queue_1 = require("../../../shared/services/queues/post.queue");
const post_1 = require("../../../shared/sockets/post");
const joi_validation_decorators_1 = require("../../../shared/globals/decorators/joi-validation.decorators");
const post_schemes_1 = require("../schemes/post.schemes");
const cloudinary_upload_1 = require("../../../shared/globals/helpers/cloudinary-upload");
const error_handler_1 = require("../../../shared/globals/helpers/error-handler");
const image_queue_1 = require("../../../shared/services/queues/image.queue");
const postCache = new post_cache_1.PostCache();
class Update {
    posts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { post, bgColor, feelings, privacy, gifUrl, imgVersion, imgId, profilePicture } = req.body;
            const { postId } = req.params;
            const updatedPost = {
                post,
                bgColor,
                privacy,
                feelings,
                gifUrl,
                profilePicture,
                imgId,
                imgVersion,
                videoId: '',
                videoVersion: ''
            };
            const postUpdated = yield postCache.updatePostInCache(postId, updatedPost);
            post_1.socketIOPostObject.on('connection', (socket) => {
                socket.emit('update post', postUpdated, 'posts');
            });
            post_queue_1.postQueue.addPostJob('updatePostInDB', { key: postId, value: postUpdated });
            res.status(http_status_codes_1.default.OK).json({ message: 'Post updated successfully' });
        });
    }
    postWithImage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { imgId, imgVersion } = req.body;
            if (imgId && imgVersion) {
                Update.prototype.updatePostWithImage(req);
            }
            else {
                const result = yield Update.prototype.addImageToExistingPost(req);
                if (!result.public_id) {
                    throw new error_handler_1.BadRequestError(result.message);
                }
            }
            res.status(http_status_codes_1.default.OK).json({ message: 'Post with image updated successfully' });
        });
    }
    postWithVideo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { videoId, videoVersion } = req.body;
            if (videoId && videoVersion) {
                Update.prototype.updatePost(req);
            }
            else {
                const result = yield Update.prototype.addImageToExistingPost(req);
                if (!result.public_id) {
                    throw new error_handler_1.BadRequestError(result.message);
                }
            }
            res.status(http_status_codes_1.default.OK).json({ message: 'Post with video updated successfully' });
        });
    }
    updatePost(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { post, bgColor, feelings, privacy, gifUrl, imgVersion, imgId, profilePicture, videoId, videoVersion } = req.body;
            const { postId } = req.params;
            const updatedPost = {
                post,
                bgColor,
                privacy,
                feelings,
                gifUrl,
                profilePicture,
                imgId: imgId ? imgId : '',
                imgVersion: imgVersion ? imgVersion : '',
                videoId: videoId ? videoId : '',
                videoVersion: videoVersion ? videoVersion : ''
            };
            const postUpdated = yield postCache.updatePostInCache(postId, updatedPost);
            yield post_1.socketIOPostObject.on('connection', (socket) => {
                socket.emit('update post', postUpdated, 'posts');
            });
            post_queue_1.postQueue.addPostJob('updatePostInDB', { key: postId, value: postUpdated });
        });
    }
    updatePostWithImage(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { post, bgColor, feelings, privacy, gifUrl, imgVersion, imgId, profilePicture } = req.body;
            const { postId } = req.params;
            const updatedPost = {
                post,
                bgColor,
                privacy,
                feelings,
                gifUrl,
                profilePicture,
                imgId,
                imgVersion,
                videoId: '',
                videoVersion: ''
            };
            const postUpdated = yield postCache.updatePostInCache(postId, updatedPost);
            post_1.socketIOPostObject.on('connection', (socket) => {
                socket.emit('update post', postUpdated, 'posts');
            });
            post_queue_1.postQueue.addPostJob('updatePostInDB', { key: postId, value: postUpdated }); // 
        });
    }
    addImageToExistingPost(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { post, bgColor, feelings, privacy, gifUrl, profilePicture, image, video } = req.body;
            const { postId } = req.params;
            const result = (yield (0, cloudinary_upload_1.uploads)(image));
            if (!(result === null || result === void 0 ? void 0 : result.public_id)) {
                return result;
            }
            const updatedPost = {
                post,
                bgColor,
                privacy,
                feelings,
                gifUrl,
                profilePicture,
                imgId: image ? result.public_id : '',
                imgVersion: image ? result.version.toString() : '',
                videoId: video ? result.public_id : '',
                videoVersion: video ? result.version.toString() : ''
            };
            const postUpdated = yield postCache.updatePostInCache(postId, updatedPost);
            post_queue_1.postQueue.addPostJob('updatePostInDB', { key: postId, value: postUpdated });
            yield post_1.socketIOPostObject.on('connection', (socket) => {
                socket.emit('update post', postUpdated, 'posts');
            });
            if (image) {
                image_queue_1.imageQueue.addImageJob('addImageToDB', {
                    key: `${req.currentUser.userId}`,
                    imgId: result.public_id,
                    imgVersion: result.version.toString()
                });
            }
            return result;
        });
    }
}
__decorate([
    (0, joi_validation_decorators_1.joiValidation)(post_schemes_1.postSchema),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Update.prototype, "posts", null);
__decorate([
    (0, joi_validation_decorators_1.joiValidation)(post_schemes_1.postWithImageSchema),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Update.prototype, "postWithImage", null);
__decorate([
    (0, joi_validation_decorators_1.joiValidation)(post_schemes_1.postWithVideoSchema),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Update.prototype, "postWithVideo", null);
exports.Update = Update;
//# sourceMappingURL=update-post.js.map