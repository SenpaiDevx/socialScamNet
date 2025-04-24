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
const auth_mocks_1 = require("../../../../mocks/auth.mocks");
const reactions_mock_1 = require("../../../../mocks/reactions.mock");
const comment_cache_1 = require("../../../../shared/services/redis/comment.cache");
const comment_queue_1 = require("../../../../shared/services/queues/comment.queue");
// import { Add } from '../../controllers/add-comment';
const add_comment_1 = require("../add-comment");
const user_mock_1 = require("../../../../mocks/user.mock");
jest.useFakeTimers();
jest.mock('@service/queues/base.queue');
jest.mock('@service/redis/comment.cache');
describe('Add', () => {
    beforeEach(() => {
        jest.restoreAllMocks();
    });
    afterEach(() => {
        jest.clearAllMocks();
        jest.clearAllTimers();
    });
    it('should call savePostCommentToCache and addCommentJob methods', () => __awaiter(void 0, void 0, void 0, function* () {
        const req = (0, reactions_mock_1.reactionMockRequest)({}, {
            postId: '6027f77087c9d9ccb1555268',
            comment: 'This is a comment',
            profilePicture: 'https://place-hold.it/500x500',
            userTo: `${user_mock_1.existingUser._id}`
        }, auth_mocks_1.authUserPayload);
        const res = (0, reactions_mock_1.reactionMockResponse)();
        jest.spyOn(comment_cache_1.CommentCache.prototype, 'savePostCommentToCache');
        jest.spyOn(comment_queue_1.commentQueue, 'addCommentJob');
        yield add_comment_1.Add.prototype.comment(req, res);
        expect(comment_cache_1.CommentCache.prototype.savePostCommentToCache).toHaveBeenCalled();
        expect(comment_queue_1.commentQueue.addCommentJob).toHaveBeenCalled();
    }));
    it('should send correct json response', () => __awaiter(void 0, void 0, void 0, function* () {
        const req = (0, reactions_mock_1.reactionMockRequest)({}, {
            postId: '6027f77087c9d9ccb1555268',
            comment: 'This is a comment',
            profilePicture: 'https://place-hold.it/500x500',
            userTo: `${user_mock_1.existingUser._id}`
        }, auth_mocks_1.authUserPayload);
        const res = (0, reactions_mock_1.reactionMockResponse)();
        yield add_comment_1.Add.prototype.comment(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Comment created successfully'
        });
    }));
});
//# sourceMappingURL=add-comment.test.js.map