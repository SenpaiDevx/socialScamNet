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
exports.AddUser = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const follower_cache_1 = require("../../../shared/services/redis/follower.cache");
const blocked_queue_1 = require("../../../shared/services/queues/blocked.queue");
const followerCache = new follower_cache_1.FollowerCache();
class AddUser {
    block(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { followerId } = req.params;
            AddUser.prototype.updateBlockedUser(followerId, req.currentUser.userId, 'block');
            blocked_queue_1.blockedUserQueue.addBlockedUserJob('addBlockedUserToDB', {
                keyOne: `${req.currentUser.userId}`,
                keyTwo: `${followerId}`,
                type: 'block'
            });
            res.status(http_status_codes_1.default.OK).json({ message: 'User blocked' });
        });
    }
    unblock(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { followerId } = req.params;
            AddUser.prototype.updateBlockedUser(followerId, req.currentUser.userId, 'unblock');
            blocked_queue_1.blockedUserQueue.addBlockedUserJob('removeBlockedUserFromDB', {
                keyOne: `${req.currentUser.userId}`,
                keyTwo: `${followerId}`,
                type: 'unblock'
            });
            res.status(http_status_codes_1.default.OK).json({ message: 'User unblocked' });
        });
    }
    updateBlockedUser(followerId, userId, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const blocked = followerCache.updateBlockedUserPropInCache(`${userId}`, 'blocked', `${followerId}`, type);
            const blockedBy = followerCache.updateBlockedUserPropInCache(`${followerId}`, 'blockedBy', `${userId}`, type);
            yield Promise.all([blocked, blockedBy]);
        });
    }
}
exports.AddUser = AddUser;
//# sourceMappingURL=block-user.js.map