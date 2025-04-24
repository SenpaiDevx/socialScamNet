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
exports.imageService = void 0;
const image_schema_1 = require("../../../features/images/models/image.schema");
const user_schema_1 = require("../../../features/user/models/user.schema");
const mongoose_1 = __importDefault(require("mongoose"));
class ImageService {
    addUserProfileImageToDB(userId, url, imgId, imgVersion) {
        return __awaiter(this, void 0, void 0, function* () {
            yield user_schema_1.UserModel.updateOne({ _id: userId }, { $set: { profilePicture: url } }).exec();
            yield this.addImage(userId, imgId, imgVersion, 'profile');
        });
    }
    addBackgroundImageToDB(userId, imgId, imgVersion) {
        return __awaiter(this, void 0, void 0, function* () {
            yield user_schema_1.UserModel.updateOne({ _id: userId }, { $set: { bgImageId: imgId, bgImageVersion: imgVersion } }).exec();
            yield this.addImage(userId, imgId, imgVersion, 'background');
        });
    }
    removeImageFromDB(imageId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield image_schema_1.ImageModel.deleteOne({ _id: imageId }).exec();
        });
    }
    addImage(userId, imgId, imgVersion, type) {
        return __awaiter(this, void 0, void 0, function* () {
            yield image_schema_1.ImageModel.create({
                userId,
                bgImageVersion: type === 'background' ? imgVersion : '',
                bgImageId: type === 'background' ? imgId : '',
                imgVersion,
                imgId
            });
        });
    }
    getImageByBackgroundId(bgImageId) {
        return __awaiter(this, void 0, void 0, function* () {
            const image = (yield image_schema_1.ImageModel.findOne({ bgImageId }).exec());
            return image;
        });
    }
    getImages(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const images = yield image_schema_1.ImageModel.aggregate([{ $match: { userId: new mongoose_1.default.Types.ObjectId(userId) } }]);
            return images;
        });
    }
}
exports.imageService = new ImageService();
//# sourceMappingURL=image.service.js.map