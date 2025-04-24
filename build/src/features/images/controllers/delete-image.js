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
exports.Delete = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const user_cache_1 = require("../../../shared/services/redis/user.cache");
const image_1 = require("../../../shared/sockets/image");
const image_queue_1 = require("../../../shared/services/queues/image.queue");
const image_service_1 = require("../../../shared/services/db/image.service");
const userCache = new user_cache_1.UserCache();
class Delete {
    image(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { imageId } = req.params;
            yield image_1.socketIOImageObject.on('connection', (socket) => {
                socket.emit('delete image', imageId);
            });
            image_queue_1.imageQueue.addImageJob('removeImageFromDB', {
                imageId
            });
            res.status(http_status_codes_1.default.OK).json({ message: 'Image deleted successfully' });
        });
    }
    backgroundImage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const image = yield image_service_1.imageService.getImageByBackgroundId(req.params.bgImageId);
            yield image_1.socketIOImageObject.on('connection', (socket) => {
                socket.emit('delete image', image === null || image === void 0 ? void 0 : image._id);
            });
            const bgImageId = userCache.updateSingleUserItemInCache(`${req.currentUser.userId}`, 'bgImageId', '');
            const bgImageVersion = userCache.updateSingleUserItemInCache(`${req.currentUser.userId}`, 'bgImageVersion', '');
            (yield Promise.all([bgImageId, bgImageVersion]));
            image_queue_1.imageQueue.addImageJob('removeImageFromDB', {
                imageId: image === null || image === void 0 ? void 0 : image._id
            });
            res.status(http_status_codes_1.default.OK).json({ message: 'Image deleted successfully' });
        });
    }
}
exports.Delete = Delete;
//# sourceMappingURL=delete-image.js.map