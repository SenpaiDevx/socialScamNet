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
exports.reactionService = void 0;
const reaction_schema_1 = require("../../../features/reactions/models/reaction.schema");
const user_cache_1 = require("../redis/user.cache");
const helpers_1 = require("../../globals/helpers/helpers");
const post_schema_1 = require("../../../features/post/models/post.schema");
const lodash_1 = require("lodash");
const mongoose_1 = __importDefault(require("mongoose"));
const notification_schema_1 = require("../../../features/notifications/models/notification.schema");
const email_queue_1 = require("../queues/email.queue");
const notification_template_1 = require("../emails/templates/notifications/notification-template");
const follower_1 = require("../../sockets/follower");
const userCache = new user_cache_1.UserCache();
class ReactionService {
    addReactionDataToDB(reactionData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { postId, userTo, userFrom, username, type, previousReaction, reactionObject } = reactionData;
            let updatedReactionObject = reactionObject;
            if (previousReaction) {
                updatedReactionObject = (0, lodash_1.omit)(reactionObject, ['_id']);
            }
            const updatedReaction = (yield Promise.all([
                userCache.getUserFromCache(`${userTo}`),
                reaction_schema_1.ReactionModel.replaceOne({ postId, type: previousReaction, username }, updatedReactionObject, { upsert: true }),
                post_schema_1.PostModel.findOneAndUpdate({ _id: postId }, {
                    $inc: {
                        [`reactions.${previousReaction}`]: -1,
                        [`reactions.${type}`]: 1
                    }
                }, { new: true })
            ]));
            if (updatedReaction[0].notifications.reactions && userTo !== userFrom) {
                const notificationModel = new notification_schema_1.NotificationModel();
                const notifications = yield notificationModel.insertNotification({
                    userFrom: userFrom,
                    userTo: userTo,
                    message: `${username} reacted to your post.`,
                    notificationType: 'reactions',
                    entityId: new mongoose_1.default.Types.ObjectId(postId),
                    createdItemId: new mongoose_1.default.Types.ObjectId(updatedReaction[1]._id),
                    createdAt: new Date(),
                    comment: '',
                    post: updatedReaction[2].post,
                    imgId: updatedReaction[2].imgId,
                    imgVersion: updatedReaction[2].imgVersion,
                    gifUrl: updatedReaction[2].gifUrl,
                    reaction: type
                });
                follower_1.socketIOFollowerObject.on('connection', (socket) => {
                    socket.emit('insert notification', notifications, { userTo });
                });
                const templateParams = {
                    username: updatedReaction[0].username,
                    message: `${username} reacted to your post.`,
                    header: 'Post Reaction Notification'
                };
                const template = notification_template_1.notificationTemplate.notificationMessageTemplate(templateParams);
                email_queue_1.emailQueue.addEmailJob('reactionsEmail', {
                    receiverEmail: updatedReaction[0].email,
                    template,
                    subject: 'Post reaction notification'
                });
            }
        });
    }
    ;
    removeReactionDataFromDB(reactionData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { postId, previousReaction, username } = reactionData;
            yield Promise.all([
                reaction_schema_1.ReactionModel.deleteOne({ postId, type: previousReaction, username }),
                post_schema_1.PostModel.updateOne({ _id: postId }, {
                    $inc: {
                        [`reactions.${previousReaction}`]: -1
                    }
                }, { new: true })
            ]);
        });
    }
    getPostReactions(query, sort) {
        return __awaiter(this, void 0, void 0, function* () {
            const reactions = yield reaction_schema_1.ReactionModel.aggregate([{ $match: query }, { $sort: sort }]);
            return [reactions, reactions.length];
        });
    }
    getSinglePostReactionByUsername(postId, username) {
        return __awaiter(this, void 0, void 0, function* () {
            const reactions = yield reaction_schema_1.ReactionModel.aggregate([
                { $match: { postId: new mongoose_1.default.Types.ObjectId(postId), username: helpers_1.Helpers.firstLetterUppercase(username) } }
            ]);
            return reactions.length ? [reactions[0], 1] : [];
        });
    }
    getReactionsByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const reactions = yield reaction_schema_1.ReactionModel.aggregate([
                { $match: { username: helpers_1.Helpers.firstLetterUppercase(username) } }
            ]);
            return reactions;
        });
    }
}
exports.reactionService = new ReactionService();
//# sourceMappingURL=reaction.service.js.map