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
const followers_mock_1 = require("../../../../mocks/followers.mock");
const user_mock_1 = require("../../../../mocks/user.mock");
const follower_queue_1 = require("../../../../shared/services/queues/follower.queue");
const follower_cache_1 = require("../../../../shared/services/redis/follower.cache");
const unfollow_user_1 = require("../../controllers/unfollow-user");
jest.useFakeTimers();
jest.mock('@service/queues/base.queue');
jest.mock('@service/redis/follower.cache');
describe('Remove', () => {
    beforeEach(() => {
        jest.restoreAllMocks();
    });
    afterEach(() => {
        jest.clearAllMocks();
        jest.clearAllTimers();
    });
    it('should send correct json response', () => __awaiter(void 0, void 0, void 0, function* () {
        const req = (0, followers_mock_1.followersMockRequest)({}, auth_mocks_1.authUserPayload, {
            followerId: '6064861bc25eaa5a5d2f9bf4',
            followeeId: `${user_mock_1.existingUser._id}`
        });
        const res = (0, followers_mock_1.followersMockResponse)();
        jest.spyOn(follower_cache_1.FollowerCache.prototype, 'removeFollowerFromCache');
        jest.spyOn(follower_cache_1.FollowerCache.prototype, 'updateFollowersCountInCache');
        jest.spyOn(follower_queue_1.followerQueue, 'addFollowerJob');
        yield unfollow_user_1.Remove.prototype.follower(req, res);
        expect(follower_cache_1.FollowerCache.prototype.removeFollowerFromCache).toHaveBeenCalledTimes(2);
        expect(follower_cache_1.FollowerCache.prototype.removeFollowerFromCache).toHaveBeenCalledWith(`following:${req.currentUser.userId}`, req.params.followeeId);
        expect(follower_cache_1.FollowerCache.prototype.removeFollowerFromCache).toHaveBeenCalledWith(`followers:${req.params.followeeId}`, req.params.followerId);
        expect(follower_cache_1.FollowerCache.prototype.updateFollowersCountInCache).toHaveBeenCalledTimes(2);
        expect(follower_cache_1.FollowerCache.prototype.updateFollowersCountInCache).toHaveBeenCalledWith(`${req.params.followeeId}`, 'followersCount', -1);
        expect(follower_cache_1.FollowerCache.prototype.updateFollowersCountInCache).toHaveBeenCalledWith(`${req.params.followerId}`, 'followingCount', -1);
        expect(follower_queue_1.followerQueue.addFollowerJob).toHaveBeenCalledWith('removeFollowerFromDB', {
            keyOne: `${req.params.followeeId}`,
            keyTwo: `${req.params.followerId}`
        });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Unfollowed user now'
        });
    }));
});
//# sourceMappingURL=unfollow-user.test.js.map