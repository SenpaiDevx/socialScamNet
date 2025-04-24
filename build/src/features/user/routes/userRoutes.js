"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../../../shared/globals/helpers/auth-middleware");
const get_profile_1 = require("../controllers/get-profile");
const search_user_1 = require("../controllers/search-user");
const change_password_1 = require("../controllers/change-password");
const update_basic_info_1 = require("../controllers/update-basic-info");
const update_settings_1 = require("../controllers/update-settings");
class UserRoutes {
    constructor() {
        this.router = express_1.default.Router();
    }
    routes() {
        this.router.get('/user/all/:page', auth_middleware_1.authMiddleware.checkAuthentication, get_profile_1.Get.prototype.all);
        this.router.get('/user/profile', auth_middleware_1.authMiddleware.checkAuthentication, get_profile_1.Get.prototype.profile);
        this.router.get('/user/profile/:userId', auth_middleware_1.authMiddleware.checkAuthentication, get_profile_1.Get.prototype.profileByUserId);
        this.router.get('/user/profile/posts/:username/:userId/:uId', auth_middleware_1.authMiddleware.checkAuthentication, get_profile_1.Get.prototype.profileAndPosts);
        this.router.get('/user/profile/user/suggestions', auth_middleware_1.authMiddleware.checkAuthentication, get_profile_1.Get.prototype.randomUserSuggestions);
        this.router.get('/user/profile/search/:query', auth_middleware_1.authMiddleware.checkAuthentication, search_user_1.Search.prototype.user);
        this.router.put('/user/profile/change-password', auth_middleware_1.authMiddleware.checkAuthentication, change_password_1.Update.prototype.password);
        this.router.put('/user/profile/basic-info', auth_middleware_1.authMiddleware.checkAuthentication, update_basic_info_1.Edit.prototype.info);
        this.router.put('/user/profile/social-links', auth_middleware_1.authMiddleware.checkAuthentication, update_basic_info_1.Edit.prototype.social);
        this.router.put('/user/profile/settings', auth_middleware_1.authMiddleware.checkAuthentication, update_settings_1.UpdateSettings.prototype.notification);
        return this.router;
    }
}
exports.userRoutes = new UserRoutes();
//# sourceMappingURL=userRoutes.js.map