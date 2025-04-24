"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
Object.defineProperty(exports, "__esModule", { value: true });
// import { Server } from 'socket.io';
const auth_mocks_1 = require("../../../../mocks/auth.mocks");
// import * as postServer from '../../../../shared/sockets/post';
const post_mock_1 = require("../../../../mocks/post.mock");
const post_cache_1 = require("../../../../shared/services/redis/post.cache");
const post_queue_1 = require("../../../../shared/services/queues/post.queue");
const update_post_1 = require("../../controllers/update-post");
const cloudinaryUploads = __importStar(require("../../../../shared/globals/helpers/cloudinary-upload"));
jest.useFakeTimers();
jest.mock('@service/queues/base.queue');
jest.mock('@service/redis/post.cache');
jest.mock('@global/helpers/cloudinary-upload');
// Object.defineProperties(postServer, {
//   socketIOPostObject: {
//     value: new Server(),
//     writable: true
//   }
// });
describe('Update', () => {
    beforeEach(() => {
        jest.restoreAllMocks();
    });
    afterEach(() => {
        jest.clearAllMocks();
        jest.clearAllTimers();
    });
    describe('posts', () => {
        it('should send correct json response', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = (0, post_mock_1.postMockRequest)(post_mock_1.updatedPost, auth_mocks_1.authUserPayload, { postId: `${post_mock_1.postMockData._id}` });
            const res = (0, post_mock_1.postMockResponse)();
            const postSpy = jest.spyOn(post_cache_1.PostCache.prototype, 'updatePostInCache').mockResolvedValue(post_mock_1.postMockData);
            //   jest.spyOn(postServer.socketIOPostObject, 'emit');
            jest.spyOn(post_queue_1.postQueue, 'addPostJob');
            yield update_post_1.Update.prototype.posts(req, res);
            expect(postSpy).toHaveBeenCalledWith(`${post_mock_1.postMockData._id}`, post_mock_1.updatedPost);
            //   expect(postServer.socketIOPostObject.emit).toHaveBeenCalledWith('update post', postMockData, 'posts');
            expect(post_queue_1.postQueue.addPostJob).toHaveBeenCalledWith('updatePostInDB', { key: `${post_mock_1.postMockData._id}`, value: post_mock_1.postMockData });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Post updated successfully'
            });
        }));
    });
    describe('postWithImage', () => {
        it('should send correct json response if imgId and imgVersion exists', () => __awaiter(void 0, void 0, void 0, function* () {
            post_mock_1.updatedPostWithImage.imgId = '1234';
            post_mock_1.updatedPostWithImage.imgVersion = '1234';
            post_mock_1.updatedPost.imgId = '1234';
            post_mock_1.updatedPost.imgVersion = '1234';
            post_mock_1.updatedPost.post = post_mock_1.updatedPostWithImage.post;
            post_mock_1.updatedPostWithImage.image = 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ==';
            const req = (0, post_mock_1.postMockRequest)(post_mock_1.updatedPostWithImage, auth_mocks_1.authUserPayload, { postId: `${post_mock_1.postMockData._id}` });
            const res = (0, post_mock_1.postMockResponse)();
            const postSpy = jest.spyOn(post_cache_1.PostCache.prototype, 'updatePostInCache').mockImplementationOnce(() => Promise.resolve(post_mock_1.postMockData));
            //   jest.spyOn(postServer.socketIOPostObject, 'emit');
            jest.spyOn(post_queue_1.postQueue, 'addPostJob');
            yield update_post_1.Update.prototype.postWithImage(req, res);
            expect(post_cache_1.PostCache.prototype.updatePostInCache).toHaveBeenCalledWith(`${post_mock_1.postMockData._id}`, postSpy.mock.calls[0][1]);
            //   expect(postServer.socketIOPostObject.emit).toHaveBeenCalledWith('update post', postMockData, 'posts');
            expect(post_queue_1.postQueue.addPostJob).toHaveBeenCalledWith('updatePostInDB', { key: `${post_mock_1.postMockData._id}`, value: post_mock_1.postMockData });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Post with image updated successfully'
            });
        }));
        it('should send correct json response if no imgId and imgVersion', () => __awaiter(void 0, void 0, void 0, function* () {
            post_mock_1.updatedPostWithImage.imgId = '1234';
            post_mock_1.updatedPostWithImage.imgVersion = '1234';
            post_mock_1.updatedPost.imgId = '1234';
            post_mock_1.updatedPost.imgVersion = '1234';
            post_mock_1.updatedPost.post = post_mock_1.updatedPostWithImage.post;
            post_mock_1.updatedPostWithImage.image = 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ==';
            const req = (0, post_mock_1.postMockRequest)(post_mock_1.updatedPostWithImage, auth_mocks_1.authUserPayload, { postId: `${post_mock_1.postMockData._id}` });
            const res = (0, post_mock_1.postMockResponse)();
            const postSpy = jest.spyOn(post_cache_1.PostCache.prototype, 'updatePostInCache').mockImplementationOnce(() => Promise.resolve(post_mock_1.postMockData));
            jest.spyOn(cloudinaryUploads, 'uploads').mockImplementation(() => Promise.resolve({ version: '1234', public_id: '123456' }));
            //   jest.spyOn(postServer.socketIOPostObject, 'emit');
            jest.spyOn(post_queue_1.postQueue, 'addPostJob');
            yield update_post_1.Update.prototype.postWithImage(req, res);
            expect(post_cache_1.PostCache.prototype.updatePostInCache).toHaveBeenCalledWith(`${post_mock_1.postMockData._id}`, postSpy.mock.calls[0][1]);
            //   expect(postServer.socketIOPostObject.emit).toHaveBeenCalledWith('update post', postMockData, 'posts');
            expect(post_queue_1.postQueue.addPostJob).toHaveBeenCalledWith('updatePostInDB', { key: `${post_mock_1.postMockData._id}`, value: post_mock_1.postMockData });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Post with image updated successfully'
            });
        }));
    });
});
//# sourceMappingURL=update-post.test.js.map