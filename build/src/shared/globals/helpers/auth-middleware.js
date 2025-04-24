"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = exports.AuthMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../../../config");
const error_handler_1 = require("../helpers/error-handler");
class AuthMiddleware {
    verifyUser(req, res, next) {
        var _a, _b;
        if (!((_a = req.session) === null || _a === void 0 ? void 0 : _a.jwt)) {
            throw new error_handler_1.NotAuthorizedError('Token is not available. Please login again.');
        }
        try {
            const payload = jsonwebtoken_1.default.verify((_b = req.session) === null || _b === void 0 ? void 0 : _b.jwt, config_1.config.JWT_TOKEN);
            req.currentUser = payload;
        }
        catch (error) {
            throw new error_handler_1.NotAuthorizedError('Token is invalid. Please login again.');
        }
        next();
    }
    checkAuthentication(req, res, next) {
        if (!req.currentUser) {
            throw new error_handler_1.NotAuthorizedError('Authentication is required to access this route.');
        }
        next();
    }
}
exports.AuthMiddleware = AuthMiddleware;
exports.authMiddleware = new AuthMiddleware();
//# sourceMappingURL=auth-middleware.js.map