"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
const express_1 = __importDefault(require("express"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const user_cache_1 = require("../../../shared/services/redis/user.cache");
const joi_validation_decorators_1 = require("../../../shared/globals/decorators/joi-validation.decorators");
const chat_1 = require("../schemes/chat");
const mongodb_1 = require("mongodb");
const mongoose_1 = __importDefault(require("mongoose"));
const cloudinary_upload_1 = require("../../../shared/globals/helpers/cloudinary-upload");
const error_handler_1 = require("../../../shared/globals/helpers/error-handler");
const chat_2 = require("../../../shared/sockets/chat");
const notification_template_1 = require("../../../shared/services/emails/templates/notifications/notification-template");
const email_queue_1 = require("../../../shared/services/queues/email.queue");
const message_cache_1 = require("../../../shared/services/redis/message.cache");
const chat_queue_1 = require("../../../shared/services/queues/chat.queue");
// import { chatQueue } from '../../../shared/services/queues/chat.queue';
const userCache = new user_cache_1.UserCache();
const messageCache = new message_cache_1.MessageCache();
class Add {
    message(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { conversationId, receiverId, receiverUsername, receiverAvatarColor, receiverProfilePicture, body, gifUrl, isRead, selectedImage } = req.body;
            let fileUrl = '';
            const messageObjectId = new mongodb_1.ObjectId();
            const conversationObjectId = !conversationId ? new mongodb_1.ObjectId() : new mongoose_1.default.Types.ObjectId(conversationId);
            const sender = (yield userCache.getUserFromCache(`${req.currentUser.userId}`));
            if (selectedImage.length) {
                const result = (yield (0, cloudinary_upload_1.uploads)(req.body.image, req.currentUser.userId, true, true));
                if (!(result === null || result === void 0 ? void 0 : result.public_id)) {
                    throw new error_handler_1.BadRequestError(result.message);
                }
                fileUrl = `https://res.cloudinary.com/dsgbrmdes/image/upload/v${result.version}/${result.public_id}`;
            }
            const messageData = {
                _id: `${messageObjectId}`,
                conversationId: new mongoose_1.default.Types.ObjectId(conversationObjectId),
                receiverId,
                receiverAvatarColor,
                receiverProfilePicture,
                receiverUsername,
                senderUsername: `${req.currentUser.username}`,
                senderId: `${req.currentUser.userId}`,
                senderAvatarColor: `${req.currentUser.avatarColor}`,
                senderProfilePicture: `${sender.profilePicture}`,
                body,
                isRead,
                gifUrl,
                selectedImage: fileUrl,
                reaction: [],
                createdAt: new Date(),
                deleteForEveryone: false,
                deleteForMe: false
            };
            Add.prototype.emitSocketIOEvent(messageData);
            if (!isRead) {
                Add.prototype.messageNotification({
                    currentUser: req.currentUser,
                    message: body,
                    receiverName: receiverUsername,
                    receiverId,
                    messageData
                });
            }
            var pops = {
                1: 'add sender to chat list in cache',
                2: 'add receiver to chat list in cache',
                3: 'add message data to cache',
                4: 'add message to chat queue'
            };
            yield messageCache.addChatListToCache(`${req.currentUser.userId}`, `${receiverId}`, `${conversationObjectId}`);
            yield messageCache.addChatListToCache(`${receiverId}`, `${req.currentUser.userId}`, `${conversationObjectId}`);
            yield messageCache.addChatMessageToCache(`${conversationObjectId}`, messageData);
            chat_queue_1.chatQueue.addChatJob('addChatMessageToDB', messageData);
            res.status(http_status_codes_1.default.OK).json({ message: 'Message added', conversationId: conversationObjectId });
        });
    }
    addChatUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const chatUsers = yield messageCache.addChatUsersToCache(req.body);
            chat_2.socketIOChatObject.on('connection', (socket) => {
                socket.emit('add chat users', chatUsers);
            });
            res.status(http_status_codes_1.default.OK).json({ message: 'Users added' });
        });
    }
    removeChatUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const chatUsers = yield messageCache.removeChatUsersFromCache(req.body);
            chat_2.socketIOChatObject.emit('add chat users', chatUsers);
            res.status(http_status_codes_1.default.OK).json({ message: 'Users removed' });
        });
    }
    emitSocketIOEvent(data) {
        chat_2.socketIOChatObject.on('connection', (socket) => {
            socket.emit('message received', data);
            socket.emit('chat list', data);
        });
    }
    messageNotification({ currentUser, message, receiverName, receiverId }) {
        return __awaiter(this, void 0, void 0, function* () {
            const cachedUser = (yield userCache.getUserFromCache(`${receiverId}`));
            if (cachedUser.notifications.messages) {
                const templateParams = {
                    username: receiverName,
                    message,
                    header: `Message notification from ${currentUser.username}`
                };
                const template = notification_template_1.notificationTemplate.notificationMessageTemplate(templateParams);
                email_queue_1.emailQueue.addEmailJob('directMessageEmail', {
                    receiverEmail: cachedUser.email,
                    template,
                    subject: `You've received messages from ${currentUser.username}`
                });
            }
        });
    }
}
__decorate([
    (0, joi_validation_decorators_1.joiValidation)(chat_1.addChatSchema),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Add.prototype, "message", null);
exports.Add = Add;
//# sourceMappingURL=add-chat-message.js.map