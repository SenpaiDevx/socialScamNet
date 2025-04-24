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
exports.Update = void 0;
const express_1 = __importDefault(require("express"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const moment_1 = __importDefault(require("moment"));
const ip_1 = __importDefault(require("ip"));
const joi_validation_decorators_1 = require("../../../shared/globals/decorators/joi-validation.decorators");
const info_1 = require("../schemes/info");
const error_handler_1 = require("../../../shared/globals/helpers/error-handler");
const auth_services_1 = require("../../../shared/services/db/auth.services");
const reset_password_template_1 = require("../../../shared/services/emails/templates/reset-password/reset-password-template");
const email_queue_1 = require("../../../shared/services/queues/email.queue");
class Update {
    password(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { currentPassword, newPassword, confirmPassword } = req.body;
            if (newPassword !== confirmPassword) {
                throw new error_handler_1.BadRequestError('Passwords do not match.');
            }
            const existingUser = yield auth_services_1.authService.getAuthUserByUsername(req.currentUser.username);
            const passwordsMatch = yield existingUser.comparePassword(currentPassword);
            if (!passwordsMatch) {
                throw new error_handler_1.BadRequestError('Invalid credentials');
            }
            const hashedPassword = yield existingUser.hashPassword(newPassword);
            auth_services_1.authService.updatePassword(`${req.currentUser.username}`, hashedPassword);
            const templateParams = {
                username: existingUser.username,
                email: existingUser.email,
                ipaddress: ip_1.default.address(),
                date: (0, moment_1.default)().format('DD//MM//YYYY HH:mm')
            };
            const template = reset_password_template_1.resetPasswordTemplate.passwordResetConfirmationTemplate(templateParams);
            email_queue_1.emailQueue.addEmailJob('changePassword', { template, receiverEmail: existingUser.email, subject: 'Password update confirmation' });
            res.status(http_status_codes_1.default.OK).json({
                message: 'Password updated successfully. You will be redirected shortly to the login page.'
            });
        });
    }
}
__decorate([
    (0, joi_validation_decorators_1.joiValidation)(info_1.changePasswordSchema),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Update.prototype, "password", null);
exports.Update = Update;
//# sourceMappingURL=change-password.js.map