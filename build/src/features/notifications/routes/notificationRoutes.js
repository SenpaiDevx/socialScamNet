"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../../../shared/globals/helpers/auth-middleware");
const update_notification_1 = require("../controllers/update-notification");
const delete_notification_1 = require("../controllers/delete-notification");
const get_notifications_1 = require("../controllers/get-notifications");
class NotificationRoutes {
    constructor() {
        this.router = express_1.default.Router();
    }
    routes() {
        this.router.get('/notifications', auth_middleware_1.authMiddleware.checkAuthentication, get_notifications_1.Get.prototype.notifications);
        this.router.put('/notification/:notificationId', auth_middleware_1.authMiddleware.checkAuthentication, update_notification_1.Update.prototype.notification);
        this.router.delete('/notification/:notificationId', auth_middleware_1.authMiddleware.checkAuthentication, delete_notification_1.Delete.prototype.notification);
        return this.router;
    }
}
exports.notificationRoutes = new NotificationRoutes();
//# sourceMappingURL=notificationRoutes.js.map