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
exports.Update = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const mongoose_1 = __importDefault(require("mongoose"));
const message_cache_1 = require("../../../shared/services/redis/message.cache");
const chat_1 = require("../../../shared/sockets/chat");
const chat_queue_1 = require("../../../shared/services/queues/chat.queue");
const joi_validation_decorators_1 = require("../../../shared/globals/decorators/joi-validation.decorators");
const chat_2 = require("../schemes/chat");
const messageCache = new message_cache_1.MessageCache();
class Update {
    message(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { senderId, receiverId } = req.body;
            const updatedMessage = yield messageCache.updateChatMessages(`${senderId}`, `${receiverId}`);
            chat_1.socketIOChatObject.on('connection', (socket) => {
                socket.emit('message read', updatedMessage);
                socket.emit('chat list', updatedMessage);
            });
            chat_queue_1.chatQueue.addChatJob('markMessagesAsReadInDB', {
                senderId: new mongoose_1.default.Types.ObjectId(senderId),
                receiverId: new mongoose_1.default.Types.ObjectId(receiverId)
            });
            res.status(http_status_codes_1.default.OK).json({ message: 'Message marked as read' });
        });
    }
}
__decorate([
    (0, joi_validation_decorators_1.joiValidation)(chat_2.markChatSchema),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Update.prototype, "message", null);
exports.Update = Update;
//# sourceMappingURL=update-chat-message.js.map