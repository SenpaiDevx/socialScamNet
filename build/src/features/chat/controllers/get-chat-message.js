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
const message_cache_1 = require("../../../shared/services/redis/message.cache");
const chat_service_1 = require("../../../shared/services/db/chat.service");
const messageCache = new message_cache_1.MessageCache();
class Get {
    conversationList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let list = [];
            const cachedList = yield messageCache.getUserConversationList(`${req.currentUser.userId}`);
            if (cachedList.length) {
                list = cachedList;
            }
            else {
                list = yield chat_service_1.chatService.getUserConversationList(new mongoose_1.default.Types.ObjectId(req.currentUser.userId));
            }
            res.status(http_status_codes_1.default.OK).json({ message: 'User conversation list', list });
        });
    }
    messages(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { receiverId } = req.params;
            let messages = [];
            const cachedMessages = yield messageCache.getChatMessagesFromCache(`${req.currentUser.userId}`, `${receiverId}`);
            if (cachedMessages.length) {
                messages = cachedMessages;
            }
            else {
                messages = yield chat_service_1.chatService.getMessages(new mongoose_1.default.Types.ObjectId(req.currentUser.userId), new mongoose_1.default.Types.ObjectId(receiverId), { createdAt: 1 });
            }
            res.status(http_status_codes_1.default.OK).json({ message: 'User chat messages', messages });
        });
    }
}
exports.Get = Get;
//# sourceMappingURL=get-chat-message.js.map