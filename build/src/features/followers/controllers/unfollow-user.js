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
exports.Remove = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const follower_cache_1 = require("../../../shared/services/redis/follower.cache");
const follower_queue_1 = require("../../../shared/services/queues/follower.queue");
const followerCache = new follower_cache_1.FollowerCache();
class Remove {
    follower(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { followeeId, followerId } = req.params;
            const removeFollowerFromCache = followerCache.removeFollowerFromCache(`following:${req.currentUser.userId}`, followeeId);
            const removeFolloweeFromCache = followerCache.removeFollowerFromCache(`followers:${followeeId}`, followerId);
            const followersCount = followerCache.updateFollowersCountInCache(`${followeeId}`, 'followersCount', -1);
            const followeeCount = followerCache.updateFollowersCountInCache(`${followerId}`, 'followingCount', -1);
            yield Promise.all([removeFollowerFromCache, removeFolloweeFromCache, followersCount, followeeCount]);
            follower_queue_1.followerQueue.addFollowerJob('removeFollowerFromDB', {
                keyOne: `${followeeId}`,
                keyTwo: `${followerId}`
            });
            res.status(http_status_codes_1.default.OK).json({ message: 'Unfollowed user now' });
        });
    }
}
exports.Remove = Remove;
//# sourceMappingURL=unfollow-user.js.map