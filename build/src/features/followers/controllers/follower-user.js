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
exports.Add = void 0;
const mongodb_1 = require("mongodb");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const follower_cache_1 = require("../../../shared/services/redis/follower.cache");
const user_cache_1 = require("../../../shared/services/redis/user.cache");
const mongoose_1 = __importDefault(require("mongoose"));
const follower_queue_1 = require("../../../shared/services/queues/follower.queue");
const post_1 = require("../../../shared/sockets/post");
const followerCache = new follower_cache_1.FollowerCache();
const userCache = new user_cache_1.UserCache();
class Add {
    follower(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { followerId } = req.params;
            // update count in cache
            const followersCount = followerCache.updateFollowersCountInCache(`${followerId}`, 'followersCount', 1);
            const followeeCount = followerCache.updateFollowersCountInCache(`${req.currentUser.userId}`, 'followingCount', 1);
            yield Promise.all([followersCount, followeeCount]);
            const cachedFollower = userCache.getUserFromCache(followerId);
            const cachedFollowee = userCache.getUserFromCache(`${req.currentUser.userId}`);
            const response = yield Promise.all([cachedFollower, cachedFollowee]);
            const followerObjectId = new mongodb_1.ObjectId();
            const addFolloweeData = Add.prototype.userData(response[0]);
            yield post_1.socketIOPostObject.on('connection', (socket) => {
                socket.emit('add follower', addFolloweeData);
            });
            const addFollowerToCache = followerCache.saveFollowerToCache(`following:${req.currentUser.userId}`, `${followerId}`);
            const addFolloweeToCache = followerCache.saveFollowerToCache(`followers:${followerId}`, `${req.currentUser.userId}`);
            yield Promise.all([addFollowerToCache, addFolloweeToCache]);
            follower_queue_1.followerQueue.addFollowerJob('addFollowerToDB', {
                keyOne: `${req.currentUser.userId}`,
                keyTwo: `${followerId}`,
                username: req.currentUser.username,
                followerDocumentId: followerObjectId
            });
            res.status(http_status_codes_1.default.OK).json({ message: 'Following user now' });
        });
    }
    userData(user) {
        return {
            _id: new mongoose_1.default.Types.ObjectId(user._id),
            username: user.username,
            avatarColor: user.avatarColor,
            postCount: user.postsCount,
            followersCount: user.followersCount,
            followingCount: user.followingCount,
            profilePicture: user.profilePicture,
            uId: user.uId,
            userProfile: user
        };
    }
}
exports.Add = Add;
//# sourceMappingURL=follower-user.js.map