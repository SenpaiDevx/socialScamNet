"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.followerRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../../../shared/globals/helpers/auth-middleware");
const follower_user_1 = require("../controllers/follower-user");
const unfollow_user_1 = require("../controllers/unfollow-user");
const get_followers_1 = require("../controllers/get-followers");
const block_user_1 = require("../controllers/block-user");
class FollowerRoutes {
    constructor() {
        this.router = express_1.default.Router();
    }
    routes() {
        this.router.get('/user/following', auth_middleware_1.authMiddleware.checkAuthentication, get_followers_1.Get.prototype.userFollowing);
        this.router.get('/user/followers/:userId', auth_middleware_1.authMiddleware.checkAuthentication, get_followers_1.Get.prototype.userFollowers);
        this.router.put('/user/follow/:followerId', auth_middleware_1.authMiddleware.checkAuthentication, follower_user_1.Add.prototype.follower);
        this.router.put('/user/unfollow/:followeeId/:followerId', auth_middleware_1.authMiddleware.checkAuthentication, unfollow_user_1.Remove.prototype.follower);
        this.router.put('/user/block/:followerId', auth_middleware_1.authMiddleware.checkAuthentication, block_user_1.AddUser.prototype.block);
        this.router.put('/user/unblock/:followerId', auth_middleware_1.authMiddleware.checkAuthentication, block_user_1.AddUser.prototype.unblock);
        return this.router;
    }
}
exports.followerRoutes = new FollowerRoutes();
//# sourceMappingURL=followerRoutes.js.map