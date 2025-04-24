"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const password_1 = require("../controllers/password");
const signin_1 = require("../controllers/signin");
const signout_1 = require("../controllers/signout");
const signup_1 = require("../controllers/signup");
const express_1 = __importDefault(require("express"));
class AuthRoutes {
    constructor() {
        this.router = express_1.default.Router();
    }
    routes() {
        this.router.post('/signup', signup_1.SignUp.prototype.create);
        this.router.post('/signin', signin_1.SignIn.prototype.read);
        this.router.post('/forgot-password', password_1.Password.prototype.create);
        this.router.post('/reset-password/:token', password_1.Password.prototype.update);
        return this.router;
    }
    signoutRoute() {
        this.router.get('/signout', signout_1.SignOut.prototype.update);
        return this.router;
    }
}
exports.authRoutes = new AuthRoutes();
//# sourceMappingURL=authRoutes.js.map