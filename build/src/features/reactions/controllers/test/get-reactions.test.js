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
const auth_mocks_1 = require("../../../../mocks/auth.mocks");
const reactions_mock_1 = require("../../../../mocks/reactions.mock");
const reaction_service_1 = require("../../../../shared/services/db/reaction.service");
const reaction_cache_1 = require("../../../../shared/services/redis/reaction.cache");
const get_reactions_1 = require("../../controllers/get-reactions");
const post_mock_1 = require("../../../../mocks/post.mock");
const mongoose_1 = __importDefault(require("mongoose"));
jest.useFakeTimers();
jest.mock('@service/queues/base.queue');
jest.mock('@service/redis/reaction.cache');
describe('Get', () => {
    beforeEach(() => {
        jest.restoreAllMocks();
    });
    afterEach(() => {
        jest.clearAllMocks();
        jest.clearAllTimers();
    });
    describe('reactions', () => {
        it('should send correct json response if reactions exist in cache', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = (0, reactions_mock_1.reactionMockRequest)({}, {}, auth_mocks_1.authUserPayload, {
                postId: `${post_mock_1.postMockData._id}`
            });
            const res = (0, reactions_mock_1.reactionMockResponse)();
            jest.spyOn(reaction_cache_1.ReactionCache.prototype, 'getReactionsFromCache').mockResolvedValue([[reactions_mock_1.reactionData], 1]);
            yield get_reactions_1.Get.prototype.reactions(req, res);
            expect(reaction_cache_1.ReactionCache.prototype.getReactionsFromCache).toHaveBeenCalledWith(`${post_mock_1.postMockData._id}`);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Post reactions',
                reactions: [reactions_mock_1.reactionData],
                count: 1
            });
        }));
        it('should send correct json response if reactions exist in database', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = (0, reactions_mock_1.reactionMockRequest)({}, {}, auth_mocks_1.authUserPayload, {
                postId: `${post_mock_1.postMockData._id}`
            });
            const res = (0, reactions_mock_1.reactionMockResponse)();
            jest.spyOn(reaction_cache_1.ReactionCache.prototype, 'getReactionsFromCache').mockResolvedValue([[], 0]);
            jest.spyOn(reaction_service_1.reactionService, 'getPostReactions').mockResolvedValue([[reactions_mock_1.reactionData], 1]);
            yield get_reactions_1.Get.prototype.reactions(req, res);
            expect(reaction_service_1.reactionService.getPostReactions).toHaveBeenCalledWith({ postId: new mongoose_1.default.Types.ObjectId(`${post_mock_1.postMockData._id}`) }, { createdAt: -1 });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Post reactions',
                reactions: [reactions_mock_1.reactionData],
                count: 1
            });
        }));
        it('should send correct json response if reactions list is empty', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = (0, reactions_mock_1.reactionMockRequest)({}, {}, auth_mocks_1.authUserPayload, {
                postId: `${post_mock_1.postMockData._id}`
            });
            const res = (0, reactions_mock_1.reactionMockResponse)();
            jest.spyOn(reaction_cache_1.ReactionCache.prototype, 'getReactionsFromCache').mockResolvedValue([[], 0]);
            jest.spyOn(reaction_service_1.reactionService, 'getPostReactions').mockResolvedValue([[], 0]);
            yield get_reactions_1.Get.prototype.reactions(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Post reactions',
                reactions: [],
                count: 0
            });
        }));
    });
    describe('singleReactionByUsername', () => {
        it('should send correct json response if reactions exist in cache', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = (0, reactions_mock_1.reactionMockRequest)({}, {}, auth_mocks_1.authUserPayload, {
                postId: `${post_mock_1.postMockData._id}`,
                username: post_mock_1.postMockData.username
            });
            const res = (0, reactions_mock_1.reactionMockResponse)();
            jest.spyOn(reaction_cache_1.ReactionCache.prototype, 'getSingleReactionByUsernameFromCache').mockResolvedValue([reactions_mock_1.reactionData, 1]);
            yield get_reactions_1.Get.prototype.singleReactionByUsername(req, res);
            expect(reaction_cache_1.ReactionCache.prototype.getSingleReactionByUsernameFromCache).toHaveBeenCalledWith(`${post_mock_1.postMockData._id}`, post_mock_1.postMockData.username);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Single post reaction by username',
                reactions: reactions_mock_1.reactionData,
                count: 1
            });
        }));
        it('should send correct json response if reactions exist in database', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = (0, reactions_mock_1.reactionMockRequest)({}, {}, auth_mocks_1.authUserPayload, {
                postId: `${post_mock_1.postMockData._id}`,
                username: post_mock_1.postMockData.username
            });
            const res = (0, reactions_mock_1.reactionMockResponse)();
            jest.spyOn(reaction_cache_1.ReactionCache.prototype, 'getSingleReactionByUsernameFromCache').mockResolvedValue([]);
            jest.spyOn(reaction_service_1.reactionService, 'getSinglePostReactionByUsername').mockResolvedValue([reactions_mock_1.reactionData, 1]);
            yield get_reactions_1.Get.prototype.singleReactionByUsername(req, res);
            expect(reaction_service_1.reactionService.getSinglePostReactionByUsername).toHaveBeenCalledWith(`${post_mock_1.postMockData._id}`, post_mock_1.postMockData.username);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Single post reaction by username',
                reactions: reactions_mock_1.reactionData,
                count: 1
            });
        }));
        it('should send correct json response if reactions list is empty', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = (0, reactions_mock_1.reactionMockRequest)({}, {}, auth_mocks_1.authUserPayload, {
                postId: `${post_mock_1.postMockData._id}`,
                username: post_mock_1.postMockData.username
            });
            const res = (0, reactions_mock_1.reactionMockResponse)();
            jest.spyOn(reaction_cache_1.ReactionCache.prototype, 'getSingleReactionByUsernameFromCache').mockResolvedValue([]);
            jest.spyOn(reaction_service_1.reactionService, 'getSinglePostReactionByUsername').mockResolvedValue([]);
            yield get_reactions_1.Get.prototype.singleReactionByUsername(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Single post reaction by username',
                reactions: {},
                count: 0
            });
        }));
    });
    describe('reactionsByUsername', () => {
        it('should send correct json response if reactions exist in database', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = (0, reactions_mock_1.reactionMockRequest)({}, {}, auth_mocks_1.authUserPayload, {
                username: post_mock_1.postMockData.username
            });
            const res = (0, reactions_mock_1.reactionMockResponse)();
            jest.spyOn(reaction_service_1.reactionService, 'getReactionsByUsername').mockResolvedValue([reactions_mock_1.reactionData]);
            yield get_reactions_1.Get.prototype.reactionsByUsername(req, res);
            expect(reaction_service_1.reactionService.getReactionsByUsername).toHaveBeenCalledWith(post_mock_1.postMockData.username);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'All user reactions by username',
                reactions: [reactions_mock_1.reactionData]
            });
        }));
        it('should send correct json response if reactions list is empty', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = (0, reactions_mock_1.reactionMockRequest)({}, {}, auth_mocks_1.authUserPayload, {
                username: post_mock_1.postMockData.username
            });
            const res = (0, reactions_mock_1.reactionMockResponse)();
            jest.spyOn(reaction_service_1.reactionService, 'getReactionsByUsername').mockResolvedValue([]);
            yield get_reactions_1.Get.prototype.reactionsByUsername(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'All user reactions by username',
                reactions: []
            });
        }));
    });
});
//# sourceMappingURL=get-reactions.test.js.map