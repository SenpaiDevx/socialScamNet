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
const mongoose_1 = __importDefault(require("mongoose"));
const follower_cache_1 = require("../../../shared/services/redis/follower.cache");
const follower_service_1 = require("../../../shared/services/db/follower.service");
const followerCache = new follower_cache_1.FollowerCache();
class Get {
    userFollowing(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userObjectId = new mongoose_1.default.Types.ObjectId(req.currentUser.userId);
            const cachedFollowees = yield followerCache.getFollowersFromCache(`following:${req.currentUser.userId}`);
            const following = cachedFollowees.length ? cachedFollowees : yield follower_service_1.followerService.getFolloweeData(userObjectId);
            res.status(http_status_codes_1.default.OK).json({ message: 'User following', following });
        });
    }
    userFollowers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userObjectId = new mongoose_1.default.Types.ObjectId(req.params.userId);
            const cachedFollowers = yield followerCache.getFollowersFromCache(`followers:${req.params.userId}`);
            const followers = cachedFollowers.length ? cachedFollowers : yield follower_service_1.followerService.getFollowerData(userObjectId);
            res.status(http_status_codes_1.default.OK).json({ message: 'User followers', followers });
        });
    }
}
exports.Get = Get;
//# sourceMappingURL=get-followers.js.map