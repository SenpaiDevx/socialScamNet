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
const reaction_cache_1 = require("../../../../shared/services/redis/reaction.cache");
const reaction_queue_1 = require("../../../../shared/services/queues/reaction.queue");
const add_reactions_1 = require("../../controllers/add-reactions");
jest.useFakeTimers();
jest.mock('@service/queues/base.queue');
jest.mock('@service/redis/reaction.cache');
describe('AddReaction', () => {
    beforeEach(() => {
        jest.restoreAllMocks();
    });
    afterEach(() => {
        jest.clearAllMocks();
        jest.clearAllTimers();
    });
    it('should send correct json response', () => __awaiter(void 0, void 0, void 0, function* () {
        const req = (0, reactions_mock_1.reactionMockRequest)({}, {
            postId: '6027f77087c9d9ccb1555268',
            previousReaction: 'love',
            profilePicture: 'http://place-hold.it/500x500',
            userTo: '60263f14648fed5246e322d9',
            type: 'like',
            postReactions: {
                like: 1,
                love: 0,
                happy: 0,
                wow: 0,
                sad: 0,
                angry: 0
            }
        }, auth_mocks_1.authUserPayload);
        const res = (0, reactions_mock_1.reactionMockResponse)();
        const spy = jest.spyOn(reaction_cache_1.ReactionCache.prototype, 'savePostReactionToCache');
        const reactionSpy = jest.spyOn(reaction_queue_1.reactionQueue, 'addReactionJob');
        yield add_reactions_1.Add.prototype.reaction(req, res);
        expect(reaction_cache_1.ReactionCache.prototype.savePostReactionToCache).toHaveBeenCalledWith(spy.mock.calls[0][0], spy.mock.calls[0][1], spy.mock.calls[0][2], spy.mock.calls[0][3], spy.mock.calls[0][4]);
        expect(reaction_queue_1.reactionQueue.addReactionJob).toHaveBeenCalledWith(reactionSpy.mock.calls[0][0], reactionSpy.mock.calls[0][1]);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Reaction added successfully'
        });
    }));
});
//# sourceMappingURL=add-reactions.test.js.map