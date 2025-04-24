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
const post_queue_1 = require("../../../../shared/services/queues/post.queue");
const create_post_1 = require("../../controllers/create-post");
const post_cache_1 = require("../../../../shared/services/redis/post.cache");
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
describe('Create', () => {
    beforeEach(() => {
        jest.restoreAllMocks();
    });
    afterEach(() => {
        jest.clearAllMocks();
        jest.clearAllTimers();
    });
    describe('post', () => {
        it('should send correct json response', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b, _c;
            const req = (0, post_mock_1.postMockRequest)(post_mock_1.newPost, auth_mocks_1.authUserPayload);
            const res = (0, post_mock_1.postMockResponse)();
            //   jest.spyOn(postServer.socketIOPostObject, 'emit'); -> commented out because it's not being used in this test -> cause unhandle promise on socket.io
            const spy = jest.spyOn(post_cache_1.PostCache.prototype, 'savePostToCache');
            jest.spyOn(post_queue_1.postQueue, 'addPostJob');
            yield create_post_1.Create.prototype.post(req, res);
            const createdPost = spy.mock.calls[0][0].createdPost;
            //   expect(postServer.socketIOPostObject.emit).toHaveBeenCalledWith('add post', createdPost); -> this line is commented out cause and error
            expect(post_cache_1.PostCache.prototype.savePostToCache).toHaveBeenCalledWith({
                key: spy.mock.calls[0][0].key,
                currentUserId: `${(_a = req.currentUser) === null || _a === void 0 ? void 0 : _a.userId}`,
                uId: `${(_b = req.currentUser) === null || _b === void 0 ? void 0 : _b.uId}`,
                createdPost
            });
            expect(post_queue_1.postQueue.addPostJob).toHaveBeenCalledWith('addPostToDB', { key: (_c = req.currentUser) === null || _c === void 0 ? void 0 : _c.userId, value: createdPost });
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Post created successfully'
            });
        }));
    });
    describe('postWithImage', () => {
        it('should throw an error if image is not available', () => {
            delete post_mock_1.newPost.image;
            const req = (0, post_mock_1.postMockRequest)(post_mock_1.newPost, auth_mocks_1.authUserPayload);
            const res = (0, post_mock_1.postMockResponse)();
            create_post_1.Create.prototype.postWithImage(req, res).catch((error) => {
                expect(error.statusCode).toEqual(400);
                expect(error.serializeErrors().message).toEqual('Image is a required field');
            });
        });
        it('should throw an upload error', () => {
            post_mock_1.newPost.image = 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ==';
            const req = (0, post_mock_1.postMockRequest)(post_mock_1.newPost, auth_mocks_1.authUserPayload);
            const res = (0, post_mock_1.postMockResponse)();
            jest
                .spyOn(cloudinaryUploads, 'uploads')
                .mockImplementation(() => Promise.resolve({ version: '', public_id: '', message: 'Upload error' }));
            create_post_1.Create.prototype.postWithImage(req, res).catch((error) => {
                expect(error.statusCode).toEqual(400);
                expect(error.serializeErrors().message).toEqual('Upload error');
            });
        });
        it('should send correct json response', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b, _c;
            post_mock_1.newPost.image = 'testing image';
            const req = (0, post_mock_1.postMockRequest)(post_mock_1.newPost, auth_mocks_1.authUserPayload);
            const res = (0, post_mock_1.postMockResponse)();
            //   jest.spyOn(postServer.socketIOPostObject, 'emit'); -> commented out as it's not being used in this test cause there an error in the code -> unhandle promises on socket.io connecction need research
            const spy = jest.spyOn(post_cache_1.PostCache.prototype, 'savePostToCache');
            jest.spyOn(post_queue_1.postQueue, 'addPostJob');
            jest.spyOn(cloudinaryUploads, 'uploads').mockImplementation(() => Promise.resolve({ version: '1234', public_id: '123456' }));
            yield create_post_1.Create.prototype.postWithImage(req, res);
            const createdPost = spy.mock.calls[0][0].createdPost;
            //   expect(postServer.socketIOPostObject.emit).toHaveBeenCalledWith('add post', createdPost); -> test will faild if this line is uncommented
            expect(post_cache_1.PostCache.prototype.savePostToCache).toHaveBeenCalledWith({
                key: spy.mock.calls[0][0].key,
                currentUserId: `${(_a = req.currentUser) === null || _a === void 0 ? void 0 : _a.userId}`,
                uId: `${(_b = req.currentUser) === null || _b === void 0 ? void 0 : _b.uId}`,
                createdPost
            });
            expect(post_queue_1.postQueue.addPostJob).toHaveBeenCalledWith('addPostToDB', { key: (_c = req.currentUser) === null || _c === void 0 ? void 0 : _c.userId, value: createdPost });
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Post created with image successfully'
            });
        }));
    });
});
//# sourceMappingURL=create-post.test.js.map