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
exports.Delete = void 0;
const notification_queue_1 = require("../../../shared/services/queues/notification.queue");
const notification_1 = require("../../../shared/sockets/notification");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
class Delete {
    notification(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { notificationId } = req.params;
            // socketIONotificationObject.emit('delete notification', notificationId); // Emit to all connected clients
            notification_1.socketIONotificationObject.on('connection', (socket) => {
                socket.emit('delete notification', notificationId);
            });
            notification_queue_1.notificationQueue.addNotificationJob('deleteNotification', { key: notificationId });
            res.status(http_status_codes_1.default.OK).json({ message: 'Notification deleted successfully' });
        });
    }
}
exports.Delete = Delete;
//# sourceMappingURL=delete-notification.js.map