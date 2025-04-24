"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../../../shared/globals/helpers/auth-middleware");
const add_image_1 = require("../controllers/add-image");
const delete_image_1 = require("../controllers/delete-image");
const get_images_1 = require("../controllers/get-images");
class ImageRoutes {
    constructor() {
        this.router = express_1.default.Router();
    }
    routes() {
        this.router.get('/images/:userId', auth_middleware_1.authMiddleware.checkAuthentication, get_images_1.Get.prototype.images);
        this.router.post('/images/profile', auth_middleware_1.authMiddleware.checkAuthentication, add_image_1.Add.prototype.profileImage);
        this.router.post('/images/background', auth_middleware_1.authMiddleware.checkAuthentication, add_image_1.Add.prototype.backgroundImage);
        this.router.delete('/images/:imageId', auth_middleware_1.authMiddleware.checkAuthentication, delete_image_1.Delete.prototype.image);
        this.router.delete('/images/background/:bgImageId', auth_middleware_1.authMiddleware.checkAuthentication, delete_image_1.Delete.prototype.backgroundImage);
        return this.router;
    }
}
exports.imageRoutes = new ImageRoutes();
//# sourceMappingURL=imageRoutes.js.map