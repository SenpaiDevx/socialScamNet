"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../../../shared/globals/helpers/auth-middleware");
const add_chat_message_1 = require("../controllers/add-chat-message");
const get_chat_message_1 = require("../controllers/get-chat-message");
const delete_chat_message_1 = require("../controllers/delete-chat-message");
const update_chat_message_1 = require("../controllers/update-chat-message");
const add_message_reaction_1 = require("../controllers/add-message-reaction");
class ChatRoutes {
    constructor() {
        this.router = express_1.default.Router();
    }
    routes() {
        this.router.get('/chat/message/conversation-list', auth_middleware_1.authMiddleware.checkAuthentication, get_chat_message_1.Get.prototype.conversationList);
        this.router.get('/chat/message/user/:receiverId', auth_middleware_1.authMiddleware.checkAuthentication, get_chat_message_1.Get.prototype.messages);
        this.router.post('/chat/message', auth_middleware_1.authMiddleware.checkAuthentication, add_chat_message_1.Add.prototype.message);
        this.router.post('/chat/message/remove-chat-users', auth_middleware_1.authMiddleware.checkAuthentication, add_chat_message_1.Add.prototype.removeChatUsers);
        this.router.post('/chat/message/add-chat-users', auth_middleware_1.authMiddleware.checkAuthentication, add_chat_message_1.Add.prototype.addChatUsers);
        this.router.put('/chat/message/mark-as-read', auth_middleware_1.authMiddleware.checkAuthentication, update_chat_message_1.Update.prototype.message);
        this.router.put('/chat/message/reaction', auth_middleware_1.authMiddleware.checkAuthentication, add_message_reaction_1.Message.prototype.reaction);
        this.router.delete('/chat/message/mark-as-deleted/:messageId/:senderId/:receiverId/:type', auth_middleware_1.authMiddleware.checkAuthentication, delete_chat_message_1.Delete.prototype.markMessageAsDeleted);
        return this.router;
    }
}
exports.chatRoutes = new ChatRoutes();
//# sourceMappingURL=chatRoutes.js.map