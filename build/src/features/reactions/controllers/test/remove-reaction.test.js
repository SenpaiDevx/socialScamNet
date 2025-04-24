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
const reactions_mock_1 = require("../../../../mocks/reactions.mock");
const auth_mocks_1 = require("../../../../mocks/auth.mocks");
const reaction_cache_1 = require("../../../../shared/services/redis/reaction.cache");
const reaction_queue_1 = require("../../../../shared/services/queues/reaction.queue");
const remove_reaction_1 = require("../../controllers/remove-reaction");
jest.useFakeTimers();
jest.mock('@service/queues/base.queue');
jest.mock('@service/redis/reaction.cache');
describe('Remove', () => {
    beforeEach(() => {
        jest.restoreAllMocks();
    });
    afterEach(() => {
        jest.clearAllMocks();
        jest.clearAllTimers();
    });
    it('should send correct json response', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const req = (0, reactions_mock_1.reactionMockRequest)({}, {}, auth_mocks_1.authUserPayload, {
            postId: '6027f77087c9d9ccb1555268',
            previousReaction: 'like',
            postReactions: JSON.stringify({
                like: 1,
                love: 0,
                happy: 0,
                wow: 0,
                sad: 0,
                angry: 0
            })
        });
        const res = (0, reactions_mock_1.reactionMockResponse)();
        jest.spyOn(reaction_cache_1.ReactionCache.prototype, 'removePostReactionFromCache');
        const spy = jest.spyOn(reaction_queue_1.reactionQueue, 'addReactionJob');
        yield remove_reaction_1.Remove.prototype.reaction(req, res);
        expect(reaction_cache_1.ReactionCache.prototype.removePostReactionFromCache).toHaveBeenCalledWith('6027f77087c9d9ccb1555268', `${(_a = req.currentUser) === null || _a === void 0 ? void 0 : _a.username}`, JSON.parse(req.params.postReactions));
        expect(reaction_queue_1.reactionQueue.addReactionJob).toHaveBeenCalledWith(spy.mock.calls[0][0], spy.mock.calls[0][1]);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Reaction removed from post'
        });
    }));
});
//# sourceMappingURL=remove-reaction.test.js.map