"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.currentUserRoutes = void 0;
const current_user_1 = require("../controllers/current-user");
const auth_middleware_1 = require("../../../shared/globals/helpers/auth-middleware");
const express_1 = __importDefault(require("express"));
class CurrentUserRoutes {
    constructor() {
        this.router = express_1.default.Router();
    }
    routes() {
        this.router.get('/currentuser', auth_middleware_1.authMiddleware.checkAuthentication, current_user_1.CurrentUser.prototype.read);
        return this.router;
    }
}
exports.currentUserRoutes = new CurrentUserRoutes();
//# sourceMappingURL=currentRoutes.js.map