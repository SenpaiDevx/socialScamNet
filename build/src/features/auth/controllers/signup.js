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
exports.SignUp = void 0;
const mongodb_1 = require("mongodb");
const express_1 = __importDefault(require("express"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const config_1 = require("../../../config");
const error_handler_1 = require("../../../shared/globals/helpers/error-handler");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const joi_validation_decorators_1 = require("../../../shared/globals/decorators/joi-validation.decorators");
const signup_1 = require("../schemes/signup");
const auth_services_1 = require("../../../shared/services/db/auth.services");
const helpers_1 = require("../../../shared/globals/helpers/helpers");
const cloudinary_upload_1 = require("../../../shared/globals/helpers/cloudinary-upload");
const user_cache_1 = require("../../../shared/services/redis/user.cache");
const auth_queue_1 = require("../../../shared/services/queues/auth.queue");
const user_queue_1 = require("../../../shared/services/queues/user.queue");
const userCache = new user_cache_1.UserCache();
class SignUp {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, email, password, avatarColor, avatarImage } = req.body;
            const checkIfUserExist = yield auth_services_1.authService.getUserByUsernameOrEmail(username, email);
            if (checkIfUserExist) {
                throw new error_handler_1.BadRequestError('User already SignUp Try to Login');
            }
            const authObjectId = new mongodb_1.ObjectId();
            const userObjectId = new mongodb_1.ObjectId();
            const uId = `${helpers_1.Helpers.generateRandomIntegers(12)}`;
            const authData = SignUp.prototype.signupData({
                _id: authObjectId,
                uId,
                username,
                email,
                password,
                avatarColor
            });
            const result = (yield (0, cloudinary_upload_1.uploads)(avatarImage, `${userObjectId}`, true, true));
            if (!result.public_id) {
                throw new error_handler_1.BadRequestError('File upload: Error occurred. Try again.');
            }
            // Add to redis cache
            const userDataForCache = SignUp.prototype.userData(authData, userObjectId);
            userDataForCache.profilePicture = `https://res.cloudinary.com/dyamr9ym3/image/upload/v${result.version}/${userObjectId}`;
            yield userCache.saveUserToCache(`${userObjectId}`, uId, userDataForCache);
            // Add to database
            auth_queue_1.authQueue.addAuthUserJob('addAuthUserToDB', { value: authData });
            user_queue_1.userQueue.addUserJob('addUserToDB', { value: userDataForCache });
            console.log(uId, ' : My uid.');
            const userJwt = SignUp.prototype.signToken(authData, userObjectId);
            req.session = { jwt: userJwt };
            res.status(http_status_codes_1.default.CREATED).json({ message: 'User created successfully', user: userDataForCache, token: userJwt });
        });
    }
    signToken(data, userObjectId) {
        return jsonwebtoken_1.default.sign({
            userId: userObjectId,
            uId: data.uId,
            email: data.email,
            username: data.username,
            avatarColor: data.avatarColor
        }, config_1.config.JWT_TOKEN);
    }
    signupData(data) {
        const { _id, username, email, uId, password, avatarColor } = data;
        return {
            _id,
            uId,
            username: helpers_1.Helpers.firstLetterUppercase(username),
            email: helpers_1.Helpers.lowerCase(email),
            password,
            avatarColor,
            createdAt: new Date()
        };
    }
    userData(data, userObjectId) {
        const { _id, username, email, uId, password, avatarColor } = data;
        return {
            _id: userObjectId,
            authId: _id,
            uId,
            username: helpers_1.Helpers.firstLetterUppercase(username),
            email,
            password,
            avatarColor,
            profilePicture: '',
            blocked: [],
            blockedBy: [],
            work: '',
            location: '',
            school: '',
            quote: '',
            bgImageVersion: '',
            bgImageId: '',
            followersCount: 0,
            followingCount: 0,
            postsCount: 0,
            notifications: {
                messages: true,
                reactions: true,
                comments: true,
                follows: true
            },
            social: {
                facebook: '',
                instagram: '',
                twitter: '',
                youtube: ''
            }
        };
    }
}
__decorate([
    (0, joi_validation_decorators_1.joiValidation)(signup_1.signupSchema),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SignUp.prototype, "create", null);
exports.SignUp = SignUp;
//# sourceMappingURL=signup.js.map