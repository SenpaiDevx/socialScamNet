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
exports.Add = void 0;
const express_1 = __importDefault(require("express"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const user_cache_1 = require("../../../shared/services/redis/user.cache");
const joi_validation_decorators_1 = require("../../../shared/globals/decorators/joi-validation.decorators");
const images_1 = require("../schemes/images");
const cloudinary_upload_1 = require("../../../shared/globals/helpers/cloudinary-upload");
const error_handler_1 = require("../../../shared/globals/helpers/error-handler");
const image_1 = require("../../../shared/sockets/image");
const image_queue_1 = require("../../../shared/services/queues/image.queue");
const helpers_1 = require("../../../shared/globals/helpers/helpers");
const userCache = new user_cache_1.UserCache();
class Add {
    profileImage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = (yield (0, cloudinary_upload_1.uploads)(req.body.image, req.currentUser.userId, true, true));
            if (!(result === null || result === void 0 ? void 0 : result.public_id)) {
                throw new error_handler_1.BadRequestError('File upload: Error occurred. Try again.');
            }
            const url = `https://res.cloudinary.com/dsgbrmdes/image/upload/v${result.version}/${result.public_id}`;
            const cachedUser = (yield userCache.updateSingleUserItemInCache(`${req.currentUser.userId}`, 'profilePicture', url));
            yield image_1.socketIOImageObject.on('connection', (socket) => {
                socket.emit('update user', cachedUser);
            });
            image_queue_1.imageQueue.addImageJob('addUserProfileImageToDB', {
                key: `${req.currentUser.userId}`,
                value: url,
                imgId: result.public_id,
                imgVersion: result.version.toString()
            });
            res.status(http_status_codes_1.default.OK).json({ message: 'Image added successfully' });
        });
    }
    backgroundImage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { version, publicId } = yield Add.prototype.backgroundUpload(req.body.image);
            const bgImageId = userCache.updateSingleUserItemInCache(`${req.currentUser.userId}`, 'bgImageId', publicId);
            const bgImageVersion = userCache.updateSingleUserItemInCache(`${req.currentUser.userId}`, 'bgImageVersion', version);
            const response = (yield Promise.all([bgImageId, bgImageVersion]));
            yield image_1.socketIOImageObject.on('connection', (socket) => {
                socket.emit('update user', {
                    gImageId: publicId,
                    bgImageVersion: version,
                    userId: response[0]
                });
            });
            image_queue_1.imageQueue.addImageJob('updateBGImageInDB', {
                key: `${req.currentUser.userId}`,
                imgId: publicId,
                imgVersion: version.toString()
            });
            res.status(http_status_codes_1.default.OK).json({ message: 'Image added successfully' });
        });
    }
    backgroundUpload(image) {
        return __awaiter(this, void 0, void 0, function* () {
            const isDataURL = helpers_1.Helpers.isDataURL(image);
            let version = '';
            let publicId = '';
            if (isDataURL) {
                const result = (yield (0, cloudinary_upload_1.uploads)(image));
                if (!result.public_id) {
                    throw new error_handler_1.BadRequestError(result.message);
                }
                else {
                    version = result.version.toString();
                    publicId = result.public_id;
                }
            }
            else {
                const value = image.split('/');
                version = value[value.length - 2];
                publicId = value[value.length - 1];
            }
            return { version: version.replace(/v/g, ''), publicId };
        });
    }
}
__decorate([
    (0, joi_validation_decorators_1.joiValidation)(images_1.addImageSchema),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Add.prototype, "profileImage", null);
__decorate([
    (0, joi_validation_decorators_1.joiValidation)(images_1.addImageSchema),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Add.prototype, "backgroundImage", null);
exports.Add = Add;
//# sourceMappingURL=add-image.js.map