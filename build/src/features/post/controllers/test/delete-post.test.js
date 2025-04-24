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
// import { Server } from 'socket.io';
const auth_mocks_1 = require("../../../../mocks/auth.mocks");
const post_mock_1 = require("../../../../mocks/post.mock");
const post_queue_1 = require("../../../../shared/services/queues/post.queue");
const delete_post_1 = require("../../controllers/delete-post");
const post_cache_1 = require("../../../../shared/services/redis/post.cache");
jest.useFakeTimers();
jest.mock('@service/queues/base.queue');
jest.mock('@service/redis/post.cache');
// Object.defineProperties(postServer, {
//   socketIOPostObject: {
//     value: new Server(),
//     writable: true
//   }
// });
describe('Delete', () => {
    beforeEach(() => {
        jest.restoreAllMocks();
    });
    afterEach(() => {
        jest.clearAllMocks();
        jest.clearAllTimers();
    });
    it('should send correct json response', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const req = (0, post_mock_1.postMockRequest)(post_mock_1.newPost, auth_mocks_1.authUserPayload, { postId: '12345' });
        const res = (0, post_mock_1.postMockResponse)();
        // jest.spyOn(postServer.socketIOPostObject, 'emit');
        jest.spyOn(post_cache_1.PostCache.prototype, 'deletePostFromCache');
        jest.spyOn(post_queue_1.postQueue, 'addPostJob');
        yield delete_post_1.Delete.prototype.post(req, res);
        // expect(postServer.socketIOPostObject.emit).toHaveBeenCalledWith('delete post', req.params.postId);
        expect(post_cache_1.PostCache.prototype.deletePostFromCache).toHaveBeenCalledWith(req.params.postId, `${(_a = req.currentUser) === null || _a === void 0 ? void 0 : _a.userId}`);
        expect(post_queue_1.postQueue.addPostJob).toHaveBeenCalledWith('deletePostFromDB', { keyOne: req.params.postId, keyTwo: (_b = req.currentUser) === null || _b === void 0 ? void 0 : _b.userId });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Post deleted successfully'
        });
    }));
});
//# sourceMappingURL=delete-post.test.js.map