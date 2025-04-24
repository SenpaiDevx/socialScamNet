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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationModel = void 0;
const notification_service_1 = require("../../../shared/services/db/notification.service");
const mongoose_1 = __importStar(require("mongoose"));
const notificationSchema = new mongoose_1.Schema({
    userTo: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', index: true },
    userFrom: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' },
    read: { type: Boolean, default: false },
    message: { type: String, default: '' },
    notificationType: String,
    entityId: mongoose_1.default.Types.ObjectId,
    createdItemId: mongoose_1.default.Types.ObjectId,
    comment: { type: String, default: '' },
    reaction: { type: String, default: '' },
    post: { type: String, default: '' },
    imgId: { type: String, default: '' },
    imgVersion: { type: String, default: '' },
    gifUrl: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now() }
});
notificationSchema.methods.insertNotification = function (body) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userTo, userFrom, message, notificationType, entityId, createdItemId, createdAt, comment, reaction, post, imgId, imgVersion, gifUrl } = body;
        yield NotificationModel.create({
            userTo,
            userFrom,
            message,
            notificationType,
            entityId,
            createdItemId,
            createdAt,
            comment,
            reaction,
            post,
            imgId,
            imgVersion,
            gifUrl
        });
        try {
            const notifications = yield notification_service_1.notificationService.getNotifications(userTo);
            return notifications;
        }
        catch (error) {
            return error;
        }
    });
};
const NotificationModel = (0, mongoose_1.model)('Notification', notificationSchema, 'Notification');
exports.NotificationModel = NotificationModel;
//# sourceMappingURL=notification.schema.js.map