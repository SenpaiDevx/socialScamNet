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
// import * as followerServer from '../../../../shared/sockets/follower';
const followers_mock_1 = require("../../../../mocks/followers.mock");
const user_mock_1 = require("../../../../mocks/user.mock");
const follower_queue_1 = require("../../../../shared/services/queues/follower.queue");
// import { Add } from '../../controllers/follower-user';
const follower_user_1 = require("../follower-user");
const user_cache_1 = require("../../../../shared/services/redis/user.cache");
const follower_cache_1 = require("../../../../shared/services/redis/follower.cache");
jest.useFakeTimers();
jest.mock('@service/queues/base.queue');
jest.mock('@service/redis/user.cache');
jest.mock('@service/redis/follower.cache');
// Object.defineProperties(followerServer, {
//   socketIOFollowerObject: {
//     value: new Server(),
//     writable: true
//   }
// });
describe('Add', () => {
    beforeEach(() => {
        jest.restoreAllMocks();
    });
    afterEach(() => {
        jest.clearAllMocks();
        jest.clearAllTimers();
    });
    describe('follower', () => {
        it('should call updateFollowersCountInCache', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = (0, followers_mock_1.followersMockRequest)({}, auth_mocks_1.authUserPayload, { followerId: '6064861bc25eaa5a5d2f9bf4' });
            const res = (0, followers_mock_1.followersMockResponse)();
            jest.spyOn(follower_cache_1.FollowerCache.prototype, 'updateFollowersCountInCache');
            jest.spyOn(user_cache_1.UserCache.prototype, 'getUserFromCache').mockResolvedValue(user_mock_1.existingUser);
            yield follower_user_1.Add.prototype.follower(req, res);
            expect(follower_cache_1.FollowerCache.prototype.updateFollowersCountInCache).toHaveBeenCalledTimes(2);
            expect(follower_cache_1.FollowerCache.prototype.updateFollowersCountInCache).toHaveBeenCalledWith('6064861bc25eaa5a5d2f9bf4', 'followersCount', 1);
            expect(follower_cache_1.FollowerCache.prototype.updateFollowersCountInCache).toHaveBeenCalledWith(`${user_mock_1.existingUser._id}`, 'followingCount', 1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Following user now'
            });
        }));
        it('should call saveFollowerToCache', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = (0, followers_mock_1.followersMockRequest)({}, auth_mocks_1.authUserPayload, { followerId: '6064861bc25eaa5a5d2f9bf4' });
            const res = (0, followers_mock_1.followersMockResponse)();
            //   jest.spyOn(followerServer.socketIOFollowerObject, 'emit');
            jest.spyOn(follower_cache_1.FollowerCache.prototype, 'saveFollowerToCache');
            jest.spyOn(user_cache_1.UserCache.prototype, 'getUserFromCache').mockResolvedValue(user_mock_1.existingUser);
            yield follower_user_1.Add.prototype.follower(req, res);
            expect(user_cache_1.UserCache.prototype.getUserFromCache).toHaveBeenCalledTimes(2);
            expect(follower_cache_1.FollowerCache.prototype.saveFollowerToCache).toHaveBeenCalledTimes(2);
            expect(follower_cache_1.FollowerCache.prototype.saveFollowerToCache).toHaveBeenCalledWith(`following:${req.currentUser.userId}`, '6064861bc25eaa5a5d2f9bf4');
            expect(follower_cache_1.FollowerCache.prototype.saveFollowerToCache).toHaveBeenCalledWith('followers:6064861bc25eaa5a5d2f9bf4', `${user_mock_1.existingUser._id}`);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Following user now'
            });
        }));
        it('should call followerQueue addFollowerJob', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            const req = (0, followers_mock_1.followersMockRequest)({}, auth_mocks_1.authUserPayload, { followerId: '6064861bc25eaa5a5d2f9bf4' });
            const res = (0, followers_mock_1.followersMockResponse)();
            const spy = jest.spyOn(follower_queue_1.followerQueue, 'addFollowerJob');
            jest.spyOn(user_cache_1.UserCache.prototype, 'getUserFromCache').mockResolvedValue(user_mock_1.existingUser);
            yield follower_user_1.Add.prototype.follower(req, res);
            expect(follower_queue_1.followerQueue.addFollowerJob).toHaveBeenCalledWith('addFollowerToDB', {
                keyOne: `${(_a = req.currentUser) === null || _a === void 0 ? void 0 : _a.userId}`,
                keyTwo: '6064861bc25eaa5a5d2f9bf4',
                username: (_b = req.currentUser) === null || _b === void 0 ? void 0 : _b.username,
                followerDocumentId: spy.mock.calls[0][1].followerDocumentId
            });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Following user now'
            });
        }));
    });
});
//# sourceMappingURL=follower-user.test.js.map