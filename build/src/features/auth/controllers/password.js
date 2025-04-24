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
exports.Password = void 0;
const ip_1 = __importDefault(require("ip"));
const crypto_1 = __importDefault(require("crypto"));
const moment_1 = __importDefault(require("moment"));
const config_1 = require("../../../config");
const express_1 = __importDefault(require("express"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const auth_services_1 = require("../../../shared/services/db/auth.services");
const email_queue_1 = require("../../../shared/services/queues/email.queue");
const error_handler_1 = require("../../../shared/globals/helpers/error-handler");
const password_1 = require("../schemes/password");
const joi_validation_decorators_1 = require("../../../shared/globals/decorators/joi-validation.decorators");
const forgot_password_template_1 = require("../../../shared/services/emails/templates/forgot-password/forgot-password-template");
const reset_password_template_1 = require("../../../shared/services/emails/templates/reset-password/reset-password-template");
class Password {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            const existingUser = yield auth_services_1.authService.getAuthUserByEmail(email);
            if (!existingUser)
                throw new error_handler_1.BadRequestError('Invalid credentials');
            const randomBytes = yield Promise.resolve(crypto_1.default.randomBytes(20));
            const randomCharacters = randomBytes.toString('hex');
            yield auth_services_1.authService.updatePasswordToken(`${existingUser._id}`, randomCharacters, Date.now() * 60 * 60 * 1000);
            const resetLink = `${config_1.config.CLIENT_URL}/reset-password?token=${randomCharacters}`;
            const template = forgot_password_template_1.forgotPasswordTemplate.passwordResetTemplate(existingUser.username, resetLink);
            email_queue_1.emailQueue.addEmailJob('forgotPasswordEmail', { template, receiverEmail: email, subject: 'Reset your password' });
            res.status(http_status_codes_1.default.OK).json({ message: 'Password reset email sent.' });
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { password, confirmPassword } = req.body;
            const { token } = req.params;
            if (password !== confirmPassword)
                throw new error_handler_1.BadRequestError('Passwords should match');
            const existingUser = yield auth_services_1.authService.getAuthUserByPasswordToken(token);
            if (!existingUser)
                throw new error_handler_1.BadRequestError('Reset token has expired.');
            //password updater
            existingUser.password = password;
            existingUser.passwordResetExpires = undefined;
            existingUser.passwordResetToken = undefined;
            yield existingUser.save();
            const templateParams = {
                username: existingUser.username,
                email: existingUser.email,
                ipaddress: ip_1.default.address(),
                date: (0, moment_1.default)().format('DD//MM//YYYY HH:mm')
            };
            const template = reset_password_template_1.resetPasswordTemplate.passwordResetConfirmationTemplate(templateParams);
            email_queue_1.emailQueue.addEmailJob('forgotPasswordEmail', { template, receiverEmail: existingUser.email, subject: 'Password Reset Confirmation' });
            res.status(http_status_codes_1.default.OK ? http_status_codes_1.default.OK : 400).json({ message: 'Password successfully updated.' });
        });
    }
}
__decorate([
    (0, joi_validation_decorators_1.joiValidation)(password_1.emailSchema),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Password.prototype, "create", null);
exports.Password = Password;
//# sourceMappingURL=password.js.map