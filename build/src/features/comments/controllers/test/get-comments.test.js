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
const mongoose_1 = __importDefault(require("mongoose"));
const auth_mocks_1 = require("../../../../mocks/auth.mocks");
const reactions_mock_1 = require("../../../../mocks/reactions.mock");
const comment_cache_1 = require("../../../../shared/services/redis/comment.cache");
const get_comments_1 = require("../../controllers/get-comments");
const comment_service_1 = require("../../../../shared/services/db/comment.service");
jest.useFakeTimers();
jest.mock('@service/queues/base.queue');
jest.mock('@service/redis/comment.cache');
describe('Get', () => {
    beforeEach(() => {
        jest.restoreAllMocks();
    });
    afterEach(() => {
        jest.clearAllMocks();
        jest.clearAllTimers();
    });
    describe('comments', () => {
        it('should send correct json response if comments exist in cache', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = (0, reactions_mock_1.reactionMockRequest)({}, {}, auth_mocks_1.authUserPayload, {
                postId: '6027f77087c9d9ccb1555268'
            });
            const res = (0, reactions_mock_1.reactionMockResponse)();
            jest.spyOn(comment_cache_1.CommentCache.prototype, 'getCommentsFromCache').mockResolvedValue([reactions_mock_1.commentsData]);
            yield get_comments_1.Get.prototype.comments(req, res);
            expect(comment_cache_1.CommentCache.prototype.getCommentsFromCache).toHaveBeenCalledWith('6027f77087c9d9ccb1555268');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Post comments',
                comments: [reactions_mock_1.commentsData]
            });
        }));
        it('should send correct json response if comments exist in database', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = (0, reactions_mock_1.reactionMockRequest)({}, {}, auth_mocks_1.authUserPayload, {
                postId: '6027f77087c9d9ccb1555268'
            });
            const res = (0, reactions_mock_1.reactionMockResponse)();
            jest.spyOn(comment_cache_1.CommentCache.prototype, 'getCommentsFromCache').mockResolvedValue([]);
            jest.spyOn(comment_service_1.commentService, 'getPostComments').mockResolvedValue([reactions_mock_1.commentsData]);
            yield get_comments_1.Get.prototype.comments(req, res);
            expect(comment_service_1.commentService.getPostComments).toHaveBeenCalledWith({ postId: new mongoose_1.default.Types.ObjectId('6027f77087c9d9ccb1555268') }, { createdAt: -1 });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Post comments',
                comments: [reactions_mock_1.commentsData]
            });
        }));
    });
    describe('commentsNamesFromCache', () => {
        it('should send correct json response if data exist in redis', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = (0, reactions_mock_1.reactionMockRequest)({}, {}, auth_mocks_1.authUserPayload, {
                postId: '6027f77087c9d9ccb1555268'
            });
            const res = (0, reactions_mock_1.reactionMockResponse)();
            jest.spyOn(comment_cache_1.CommentCache.prototype, 'getCommentsNamesFromCache').mockResolvedValue([reactions_mock_1.commentNames]);
            yield get_comments_1.Get.prototype.commentsNamesFromCache(req, res);
            expect(comment_cache_1.CommentCache.prototype.getCommentsNamesFromCache).toHaveBeenCalledWith('6027f77087c9d9ccb1555268');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Post comments names',
                comments: reactions_mock_1.commentNames
            });
        }));
        it('should send correct json response if data exist in database', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = (0, reactions_mock_1.reactionMockRequest)({}, {}, auth_mocks_1.authUserPayload, {
                postId: '6027f77087c9d9ccb1555268'
            });
            const res = (0, reactions_mock_1.reactionMockResponse)();
            jest.spyOn(comment_cache_1.CommentCache.prototype, 'getCommentsNamesFromCache').mockResolvedValue([]);
            jest.spyOn(comment_service_1.commentService, 'getPostCommentNames').mockResolvedValue([reactions_mock_1.commentNames]);
            yield get_comments_1.Get.prototype.commentsNamesFromCache(req, res);
            expect(comment_service_1.commentService.getPostCommentNames).toHaveBeenCalledWith({ postId: new mongoose_1.default.Types.ObjectId('6027f77087c9d9ccb1555268') }, { createdAt: -1 });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Post comments names',
                comments: reactions_mock_1.commentNames
            });
        }));
        it('should return empty comments if data does not exist in redis and database', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = (0, reactions_mock_1.reactionMockRequest)({}, {}, auth_mocks_1.authUserPayload, {
                postId: '6027f77087c9d9ccb1555268'
            });
            const res = (0, reactions_mock_1.reactionMockResponse)();
            jest.spyOn(comment_cache_1.CommentCache.prototype, 'getCommentsNamesFromCache').mockResolvedValue([]);
            jest.spyOn(comment_service_1.commentService, 'getPostCommentNames').mockResolvedValue([]);
            yield get_comments_1.Get.prototype.commentsNamesFromCache(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Post comments names',
                comments: []
            });
        }));
    });
    describe('singleComment', () => {
        it('should send correct json response from cache', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = (0, reactions_mock_1.reactionMockRequest)({}, {}, auth_mocks_1.authUserPayload, {
                commentId: '6064861bc25eaa5a5d2f9bf4',
                postId: '6027f77087c9d9ccb1555268'
            });
            const res = (0, reactions_mock_1.reactionMockResponse)();
            jest.spyOn(comment_cache_1.CommentCache.prototype, 'getSingleCommentFromCache').mockResolvedValue([reactions_mock_1.commentsData]);
            yield get_comments_1.Get.prototype.singleComment(req, res);
            expect(comment_cache_1.CommentCache.prototype.getSingleCommentFromCache).toHaveBeenCalledWith('6027f77087c9d9ccb1555268', '6064861bc25eaa5a5d2f9bf4');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Single comment',
                comments: reactions_mock_1.commentsData
            });
        }));
        it('should send correct json response from database', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = (0, reactions_mock_1.reactionMockRequest)({}, {}, auth_mocks_1.authUserPayload, {
                commentId: '6064861bc25eaa5a5d2f9bf4',
                postId: '6027f77087c9d9ccb1555268'
            });
            const res = (0, reactions_mock_1.reactionMockResponse)();
            jest.spyOn(comment_cache_1.CommentCache.prototype, 'getSingleCommentFromCache').mockResolvedValue([]);
            jest.spyOn(comment_service_1.commentService, 'getPostComments').mockResolvedValue([reactions_mock_1.commentsData]);
            yield get_comments_1.Get.prototype.singleComment(req, res);
            expect(comment_service_1.commentService.getPostComments).toHaveBeenCalledWith({ _id: new mongoose_1.default.Types.ObjectId('6064861bc25eaa5a5d2f9bf4') }, { createdAt: -1 });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Single comment',
                comments: reactions_mock_1.commentsData
            });
        }));
    });
});
//# sourceMappingURL=get-comments.test.js.map