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
exports.mailTransport = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const mail_1 = __importDefault(require("@sendgrid/mail"));
const config_1 = require("../../../config");
const error_handler_1 = require("../../globals/helpers/error-handler");
const log = config_1.config.createLogger('mailOptions');
mail_1.default.setApiKey(config_1.config.SENDGRID_API_KEY);
class MailTransport {
    sendEmail(receiverEmail, subject, body) {
        return __awaiter(this, void 0, void 0, function* () {
            if (config_1.config.NODE_ENV === 'test' || config_1.config.NODE_ENV === 'development') {
                this.developementEmailSender(receiverEmail, subject, body);
            }
            else {
                this.productionEmailSender(receiverEmail, subject, body);
            }
        });
    }
    developementEmailSender(receiverEmail, subject, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const transporter = nodemailer_1.default.createTransport({
                host: "smtp.ethereal.email",
                port: 587,
                secure: false,
                auth: {
                    user: config_1.config.SENDER_EMAIL,
                    pass: config_1.config.SENDER_EMAIL_PASSWORD,
                },
            });
            const mailOptions = {
                from: `Social Scam Provider : <${config_1.config.SENDER_EMAIL}>`,
                to: receiverEmail,
                subject,
                html: body
            };
            try {
                yield transporter.sendMail(mailOptions);
                log.info(' Email are sending properly withp8t hesiteation');
            }
            catch (error) {
                log.error('Error sending email to me i can isiis ', error);
                throw new error_handler_1.BadRequestError('Error Sending Email can check it please ugh');
            }
        });
    }
    productionEmailSender(receiverEmail, subject, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const mailOptions = {
                from: `Social Scam Provider : <${config_1.config.SENDER_EMAIL}>`,
                to: receiverEmail,
                subject,
                html: body
            };
            try {
                yield mail_1.default.send(mailOptions);
                log.info('Prod email has been sending to Earth');
            }
            catch (error) {
                log.error('Error sending email to me i can isiis ', error);
                throw new error_handler_1.BadRequestError('Error Sending Email can check it please ugh');
            }
        });
    }
}
exports.mailTransport = new MailTransport();
//
//# sourceMappingURL=mail.transport.js.map