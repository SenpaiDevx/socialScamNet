"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const bunyan_1 = __importDefault(require("bunyan"));
const cloudinary_1 = __importDefault(require("cloudinary"));
dotenv_1.default.config({});
class Config {
    constructor() {
        this.DEFAULT_DATABASE_URL = 'mongodb://localhost:27017/socialScam-db';
        this.DATABASE_URL = process.env.DATABASE_URL || this.DEFAULT_DATABASE_URL;
        this.JWT_TOKEN = process.env.JWT_TOKEN || '1234';
        this.NODE_ENV = process.env.NODE_ENV || '';
        this.SECRET_KEY_ONE = process.env.SECRET_KEY_ONE || '';
        this.SECRET_KEY_TWO = process.env.SECRET_KEY_TWO || '';
        this.CLIENT_URL = process.env.CLIENT_URL || '';
        this.REDIS_HOST = process.env.REDIS_HOST || '';
        this.CLOUD_NAME = process.env.CLOUD_NAME || '';
        this.CLOUD_API_KEY = process.env.CLOUD_API_KEY || '';
        this.CLOUD_API_SECRET = process.env.CLOUD_API_SECRET || '';
        this.SENDER_EMAIL = process.env.SENDER_EMAIL || '';
        this.SENDER_EMAIL_PASSWORD = process.env.SENDER_EMAIL_PASSWORD || '';
        this.SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || '';
        this.SENDGRID_SENDER = process.env.SENDGRID_SENDER || '';
        this.EC2_URL = process.env.EC2_URL || '';
        this.API_URL = process.env.API_URL || '';
    }
    createLogger(name) {
        return bunyan_1.default.createLogger({ name, level: 'debug' });
    }
    validateConfig() {
        for (const [key, value] of Object.entries(this)) {
            if (value === undefined) {
                throw new Error(' Missing configuration for ' + key);
            }
        }
    }
    cloudinaryConfig() {
        cloudinary_1.default.v2.config({
            cloud_name: this.CLOUD_NAME,
            api_key: this.CLOUD_API_KEY,
            api_secret: this.CLOUD_API_SECRET
        });
    }
}
exports.config = new Config();
//# sourceMappingURL=config.js.map