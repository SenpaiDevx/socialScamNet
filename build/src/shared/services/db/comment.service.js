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
exports.commentService = void 0;
const comment_schema_1 = require("../../../features/comments/models/comment.schema");
const mongoose_1 = __importDefault(require("mongoose"));
const user_cache_1 = require("../redis/user.cache");
const post_schema_1 = require("../../../features/post/models/post.schema");
const notification_schema_1 = require("../../../features/notifications/models/notification.schema");
const notification_1 = require("../../sockets/notification");
const notification_template_1 = require("../emails/templates/notifications/notification-template");
const email_queue_1 = require("../queues/email.queue");
const userCache = new user_cache_1.UserCache();
class CommentService {
    addCommentToDB(commentData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { postId, userTo, userFrom, comment, username } = commentData;
            const comments = comment_schema_1.CommentsModel.create(comment);
            const post = post_schema_1.PostModel.findOneAndUpdate({ _id: postId }, { $inc: { commentsCount: 1 } }, { new: true });
            const user = userCache.getUserFromCache(userTo);
            const response = yield Promise.all([comments, post, user]);
            if (response[2].notifications.comments && userFrom !== userTo) {
                const notificationModel = new notification_schema_1.NotificationModel();
                const notification = yield notificationModel.insertNotification({
                    userFrom,
                    userTo,
                    message: `${username} commented on your post as per meme`,
                    notificationType: 'comment',
                    entityId: new mongoose_1.default.Types.ObjectId(postId),
                    createdItemId: new mongoose_1.default.Types.ObjectId(response[0]._id),
                    createdAt: new Date(),
                    comment: comment.comment,
                    post: response[1].post,
                    imgId: response[1].imgId,
                    imgVersion: response[1].imgVersion,
                    gifUrl: response[1].gifUrl,
                    reaction: ''
                });
                // send to client with socket.io
                yield notification_1.socketIONotificationObject.on('connection', (socket) => {
                    socket.emit('insert notification', notification, { userTo });
                });
                // send to email queue
                const templateParams = {
                    username: response[2].username,
                    message: `${username} commented on your post.`,
                    header: 'Comment Notification'
                };
                const template = notification_template_1.notificationTemplate.notificationMessageTemplate(templateParams);
                email_queue_1.emailQueue.addEmailJob('commentsEmail', { receiverEmail: response[2].email, template, subject: 'Post notification' });
            }
        });
    }
    getPostComments(query, sort) {
        return __awaiter(this, void 0, void 0, function* () {
            const comments = yield comment_schema_1.CommentsModel.aggregate([{ $match: query }, { $sort: sort }]);
            return comments;
        });
    }
    getPostCommentNames(query, sort) {
        return __awaiter(this, void 0, void 0, function* () {
            const commentsNamesList = yield comment_schema_1.CommentsModel.aggregate([
                { $match: query },
                { $sort: sort },
                { $group: { _id: null, names: { $addToSet: '$username' }, count: { $sum: 1 } } },
                { $project: { _id: 0 } }
            ]);
            return commentsNamesList;
        });
    }
}
exports.commentService = new CommentService();
//# sourceMappingURL=comment.service.js.map