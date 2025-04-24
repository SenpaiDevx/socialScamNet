"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const messageSchema = new mongoose_1.Schema({
    conversationId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Conversation' },
    senderId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' },
    receiverId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' },
    senderUsername: { type: String, default: '' },
    senderAvatarColor: { type: String, default: '' },
    senderProfilePicture: { type: String, default: '' },
    receiverUsername: { type: String, default: '' },
    receiverAvatarColor: { type: String, default: '' },
    receiverProfilePicture: { type: String, default: '' },
    body: { type: String, default: '' },
    gifUrl: { type: String, default: '' },
    isRead: { type: Boolean, default: false },
    deleteForMe: { type: Boolean, default: false },
    deleteForEveryone: { type: Boolean, default: false },
    selectedImage: { type: String, default: '' },
    reaction: Array,
    createdAt: { type: Date, default: Date.now }
});
const MessageModel = (0, mongoose_1.model)('Message', messageSchema, 'Message');
exports.MessageModel = MessageModel;
//# sourceMappingURL=chat.schema.js.map