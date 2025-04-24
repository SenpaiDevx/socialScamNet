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
exports.SignIn = void 0;
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../../../config");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const signin_1 = require("../schemes/signin");
const user_service_1 = require("../../../shared/services/db/user.service");
const auth_services_1 = require("../../../shared/services/db/auth.services");
const error_handler_1 = require("../../../shared/globals/helpers/error-handler");
const joi_validation_decorators_1 = require("../../../shared/globals/decorators/joi-validation.decorators");
class SignIn {
    read(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, password } = req.body;
            const existingUser = yield auth_services_1.authService.getAuthUserByUsername(username);
            if (!existingUser)
                throw new error_handler_1.BadRequestError('Invalid credentials');
            const passwordsMatch = yield existingUser.comparePassword(password);
            if (!passwordsMatch)
                throw new error_handler_1.BadRequestError('Invalid password');
            const user = yield user_service_1.userService.getUserByAuthId(`${existingUser._id}`);
            const userJwt = jsonwebtoken_1.default.sign({
                userId: user._id,
                uId: existingUser.uId,
                email: existingUser.email,
                username: existingUser.username,
                avatarColor: existingUser.avatarColor
            }, config_1.config.JWT_TOKEN);
            req.session = { jwt: userJwt };
            const userDocument = Object.assign(Object.assign({}, user), { authId: existingUser._id, username: existingUser.username, email: existingUser.email, avatarColor: existingUser.avatarColor, uId: existingUser.uId, createdAt: existingUser.createdAt });
            // const resetLink = `${config.CLIENT_URL}/reset-password?token=${userJwt}`
            // const template = forgotPasswordTemplate.passwordResetTemplate(username, resetLink);
            // emailQueue.addEmailJob('forgotPasswordEmail', { template, receiverEmail: 'kali23@ethereal.email', subject: 'I think you forgot your password click the link' })
            // const templateParam: IResetPasswordParams = {
            //     username: existingUser.username!,
            //     email: existingUser.email!,
            //     ipaddress: publicIP.address(),
            //     date: moment().format('DD/MM/YY HH:mm')
            // }
            // const resetTemplate = resetPasswordTemplate.passwordResetConfirmationTemplate(templateParam);
            // emailQueue.addEmailJob('resetPasswordEmail', {template : resetTemplate, receiverEmail : 'kali23@ethereal.email', subject : 'click the button to get the reset email confirmation! =)'})
            res.status(http_status_codes_1.default.OK).json({ message: 'User login successfully', user: userDocument, token: userJwt });
        });
    }
}
__decorate([
    (0, joi_validation_decorators_1.joiValidation)(signin_1.loginSchema),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SignIn.prototype, "read", null);
exports.SignIn = SignIn;
//# sourceMappingURL=signin.js.map