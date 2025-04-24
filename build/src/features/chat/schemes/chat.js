"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markChatSchema = exports.addChatSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const addChatSchema = joi_1.default.object().keys({
    conversationId: joi_1.default.string().optional().allow(null, ''),
    receiverId: joi_1.default.string().required(),
    receiverUsername: joi_1.default.string().required(),
    receiverAvatarColor: joi_1.default.string().required(),
    receiverProfilePicture: joi_1.default.string().required(),
    body: joi_1.default.string().optional().allow(null, ''),
    gifUrl: joi_1.default.string().optional().allow(null, ''),
    selectedImage: joi_1.default.string().optional().allow(null, ''),
    isRead: joi_1.default.boolean().optional()
});
exports.addChatSchema = addChatSchema;
const markChatSchema = joi_1.default.object().keys({
    senderId: joi_1.default.string().required(),
    receiverId: joi_1.default.string().required()
});
exports.markChatSchema = markChatSchema;
//# sourceMappingURL=chat.js.map