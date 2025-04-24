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
exports.followerService = void 0;
const follower_schema_1 = require("../../../features/followers/models/follower.schema");
const user_schema_1 = require("../../../features/user/models/user.schema");
const mongoose_1 = __importDefault(require("mongoose"));
const email_queue_1 = require("../queues/email.queue");
const user_cache_1 = require("../redis/user.cache");
const lodash_1 = require("lodash");
const notification_template_1 = require("../emails/templates/notifications/notification-template");
const notification_1 = require("../../sockets/notification");
const notification_schema_1 = require("../../../features/notifications/models/notification.schema");
const userCache = new user_cache_1.UserCache();
class FollowerService {
    addFollowerToDB(userId, followeeId, username, followerDocumentId) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const followeeObjectId = new mongoose_1.default.Types.ObjectId(followeeId);
            const followerObjectId = new mongoose_1.default.Types.ObjectId(userId);
            const following = yield follower_schema_1.FollowerModel.create({
                _id: followerDocumentId,
                followeeId: followeeObjectId,
                followerId: followerObjectId
            });
            const users = user_schema_1.UserModel.bulkWrite([
                {
                    updateOne: {
                        filter: { _id: userId },
                        update: { $inc: { followingCount: 1 } }
                    }
                },
                {
                    updateOne: {
                        filter: { _id: followeeId },
                        update: { $inc: { followersCount: 1 } }
                    }
                }
            ]);
            // const response : [BulkWriteResult, IUserDocument | null] = await Promise.all([users, UserModel.findOne({ _id: followeeId })]);
            const response = yield Promise.all([users, userCache.getUserFromCache(followeeId)]);
            if (((_a = response[1]) === null || _a === void 0 ? void 0 : _a.notifications.follows) && userId !== followeeId) {
                const notificationModel = new notification_schema_1.NotificationModel();
                const notifications = yield notificationModel.insertNotification({
                    userFrom: userId,
                    userTo: followeeId,
                    message: `${username} is now following you.`,
                    notificationType: 'follows',
                    entityId: new mongoose_1.default.Types.ObjectId(userId),
                    createdItemId: new mongoose_1.default.Types.ObjectId(following._id),
                    createdAt: new Date(),
                    comment: '',
                    post: '',
                    imgId: '',
                    imgVersion: '',
                    gifUrl: '',
                    reaction: ''
                });
                yield notification_1.socketIONotificationObject.on('connection', (socket) => {
                    socket.emit('insert notification', notifications, { userTo: followeeId });
                });
                const templateParams = {
                    username: response[1].username,
                    message: `${username} is now following you.`,
                    header: 'Follower Notification'
                };
                const template = notification_template_1.notificationTemplate.notificationMessageTemplate(templateParams);
                email_queue_1.emailQueue.addEmailJob('followersEmail', {
                    receiverEmail: response[1].email,
                    template,
                    subject: `${username} is now following you.`
                });
            }
        });
    }
    removeFollowerFromDB(followeeId, followerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const followeeObjectId = new mongoose_1.default.Types.ObjectId(followeeId);
            const followerObjectId = new mongoose_1.default.Types.ObjectId(followerId);
            const unfollow = follower_schema_1.FollowerModel.deleteOne({
                followeeId: followeeObjectId,
                followerId: followerObjectId
            });
            const users = user_schema_1.UserModel.bulkWrite([
                {
                    updateOne: {
                        filter: { _id: followerId },
                        update: { $inc: { followingCount: -1 } }
                    }
                },
                {
                    updateOne: {
                        filter: { _id: followeeId },
                        update: { $inc: { followersCount: -1 } }
                    }
                }
            ]);
            yield Promise.all([unfollow, users]);
        });
    }
    getFolloweeData(userObjectId) {
        return __awaiter(this, void 0, void 0, function* () {
            const followee = yield follower_schema_1.FollowerModel.aggregate([
                { $match: { followerId: userObjectId } },
                { $lookup: { from: 'User', localField: 'followeeId', foreignField: '_id', as: 'followeeId' } },
                { $unwind: '$followeeId' },
                { $lookup: { from: 'Auth', localField: 'followeeId.authId', foreignField: '_id', as: 'authId' } },
                { $unwind: '$authId' },
                {
                    $addFields: {
                        _id: '$followeeId._id',
                        username: '$authId.username',
                        avatarColor: '$authId.avatarColor',
                        uId: '$authId.uId',
                        postCount: '$followeeId.postsCount',
                        followersCount: '$followeeId.followersCount',
                        followingCount: '$followeeId.followingCount',
                        profilePicture: '$followeeId.profilePicture',
                        userProfile: '$followeeId'
                    }
                },
                {
                    $project: {
                        authId: 0,
                        followerId: 0,
                        followeeId: 0,
                        createdAt: 0,
                        __v: 0
                    }
                }
            ]);
            return followee;
        });
    }
    getFollowerData(userObjectId) {
        return __awaiter(this, void 0, void 0, function* () {
            const follower = yield follower_schema_1.FollowerModel.aggregate([
                { $match: { followeeId: userObjectId } },
                { $lookup: { from: 'User', localField: 'followerId', foreignField: '_id', as: 'followerId' } },
                { $unwind: '$followerId' },
                { $lookup: { from: 'Auth', localField: 'followerId.authId', foreignField: '_id', as: 'authId' } },
                { $unwind: '$authId' },
                {
                    $addFields: {
                        _id: '$followerId._id',
                        username: '$authId.username',
                        avatarColor: '$authId.avatarColor',
                        uId: '$authId.uId',
                        postCount: '$followerId.postsCount',
                        followersCount: '$followerId.followersCount',
                        followingCount: '$followerId.followingCount',
                        profilePicture: '$followerId.profilePicture',
                        userProfile: '$followerId'
                    }
                },
                {
                    $project: {
                        authId: 0,
                        followerId: 0,
                        followeeId: 0,
                        createdAt: 0,
                        __v: 0
                    }
                }
            ]);
            return follower;
        });
    }
    getFolloweesIds(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const followee = yield follower_schema_1.FollowerModel.aggregate([
                { $match: { followerId: new mongoose_1.default.Types.ObjectId(userId) } },
                {
                    $project: {
                        followeeId: 1,
                        _id: 0
                    }
                }
            ]);
            return (0, lodash_1.map)(followee, (result) => result.followeeId.toString());
        });
    }
}
exports.followerService = new FollowerService();
//# sourceMappingURL=follower.service.js.map