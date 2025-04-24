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
exports.Get = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const follower_cache_1 = require("../../../shared/services/redis/follower.cache");
const post_cache_1 = require("../../../shared/services/redis/post.cache");
const user_cache_1 = require("../../../shared/services/redis/user.cache");
const user_service_1 = require("../../../shared/services/db/user.service");
const follower_service_1 = require("../../../shared/services/db/follower.service");
const mongoose_1 = __importDefault(require("mongoose"));
const helpers_1 = require("../../../shared/globals/helpers/helpers");
const post_service_1 = require("../../../shared/services/db/post.service");
const PAGE_SIZE = 12;
const postCache = new post_cache_1.PostCache();
const userCache = new user_cache_1.UserCache();
const followerCache = new follower_cache_1.FollowerCache();
class Get {
    all(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page } = req.params;
            const skip = (parseInt(page) - 1) * PAGE_SIZE;
            const limit = PAGE_SIZE * parseInt(page);
            const newSkip = skip === 0 ? skip : skip + 1;
            const allUsers = yield Get.prototype.allUsers({
                newSkip,
                limit,
                skip,
                userId: `${req.currentUser.userId}`
            });
            const followers = yield Get.prototype.followers(`${req.currentUser.userId}`);
            res.status(http_status_codes_1.default.OK).json({ message: 'Get users', users: allUsers.users, totalUsers: allUsers.totalUsers, followers });
        });
    }
    profile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const cachedUser = (yield userCache.getUserFromCache(`${req.currentUser.userId}`));
            const existingUser = cachedUser ? cachedUser : yield user_service_1.userService.getUserById(`${req.currentUser.userId}`);
            res.status(http_status_codes_1.default.OK).json({ message: 'Get user profile', user: existingUser });
        });
    }
    profileByUserId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = req.params;
            const cachedUser = (yield userCache.getUserFromCache(userId));
            const existingUser = cachedUser ? cachedUser : yield user_service_1.userService.getUserById(userId);
            res.status(http_status_codes_1.default.OK).json({ message: 'Get user profile by id', user: existingUser });
        });
    }
    profileAndPosts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, username, uId } = req.params;
            const userName = helpers_1.Helpers.firstLetterUppercase(username);
            const cachedUser = (yield userCache.getUserFromCache(userId));
            const cachedUserPosts = yield postCache.getUserPostsFromCache('post', parseInt(uId, 10));
            const existingUser = cachedUser ? cachedUser : yield user_service_1.userService.getUserById(userId);
            const userPosts = cachedUserPosts.length
                ? cachedUserPosts
                : yield post_service_1.postService.getPosts({ username: userName }, 0, 100, { createdAt: -1 });
            res.status(http_status_codes_1.default.OK).json({ message: 'Get user profile and posts', user: existingUser, posts: userPosts });
        });
    }
    randomUserSuggestions(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let randomUsers = [];
            const cachedUsers = yield userCache.getRandomUsersFromCache(`${req.currentUser.userId}`, req.currentUser.username);
            if (cachedUsers.length) {
                randomUsers = [...cachedUsers];
            }
            else {
                const users = yield user_service_1.userService.getRandomUsers(req.currentUser.userId);
                randomUsers = [...users];
            }
            res.status(http_status_codes_1.default.OK).json({ message: 'User suggestions', users: randomUsers });
        });
    }
    allUsers({ newSkip, limit, skip, userId }) {
        return __awaiter(this, void 0, void 0, function* () {
            let users;
            let type = '';
            const cachedUsers = (yield userCache.getUsersFromCache(newSkip, limit, userId));
            if (cachedUsers.length) {
                type = 'redis';
                users = cachedUsers;
            }
            else {
                type = 'mongodb';
                users = yield user_service_1.userService.getAllUsers(userId, skip, limit);
            }
            const totalUsers = yield Get.prototype.usersCount(type);
            return { users, totalUsers };
        });
    }
    usersCount(type) {
        return __awaiter(this, void 0, void 0, function* () {
            const totalUsers = type === 'redis' ? yield userCache.getTotalUsersInCache() : yield user_service_1.userService.getTotalUsersInDB();
            return totalUsers || 1;
        });
    }
    followers(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const cachedFollowers = yield followerCache.getFollowersFromCache(`followers:${userId}`);
            const result = cachedFollowers.length ? cachedFollowers : yield follower_service_1.followerService.getFollowerData(new mongoose_1.default.Types.ObjectId(userId));
            return result;
        });
    }
}
exports.Get = Get;
//# sourceMappingURL=get-profile.js.map