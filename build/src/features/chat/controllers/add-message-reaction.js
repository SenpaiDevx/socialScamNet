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
exports.Message = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const mongoose_1 = __importDefault(require("mongoose"));
const message_cache_1 = require("../../../shared/services/redis/message.cache");
const chat_1 = require("../../../shared/sockets/chat");
const chat_queue_1 = require("../../../shared/services/queues/chat.queue");
const messageCache = new message_cache_1.MessageCache();
class Message {
    reaction(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { conversationId, messageId, reaction, type } = req.body;
            const updatedMessage = yield messageCache.updateMessageReaction(`${conversationId}`, `${messageId}`, `${reaction}`, `${req.currentUser.username}`, type);
            yield chat_1.socketIOChatObject.on('connection', (socket) => {
                socket.emit('message reaction', updatedMessage);
            });
            chat_queue_1.chatQueue.addChatJob('updateMessageReaction', {
                messageId: new mongoose_1.default.Types.ObjectId(messageId),
                senderName: req.currentUser.username,
                reaction,
                type
            });
            res.status(http_status_codes_1.default.OK).json({ message: 'Message reaction added' });
        });
    }
}
exports.Message = Message;
//# sourceMappingURL=add-message-reaction.js.map