"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRoutes = exports.PostRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../../../shared/globals/helpers/auth-middleware");
const create_post_1 = require("../controllers/create-post");
const get_posts_1 = require("../controllers/get-posts");
const delete_post_1 = require("../controllers/delete-post");
const update_post_1 = require("../controllers/update-post");
class PostRoutes {
    constructor() {
        this.router = express_1.default.Router();
    }
    routes() {
        this.router.get('/post/all/:page', auth_middleware_1.authMiddleware.checkAuthentication, get_posts_1.GetPosts.prototype.posts);
        this.router.get('/post/images/:page', auth_middleware_1.authMiddleware.checkAuthentication, get_posts_1.GetPosts.prototype.postsWithImages);
        this.router.get('/post/videos/:page', auth_middleware_1.authMiddleware.checkAuthentication, get_posts_1.GetPosts.prototype.postsWithVideos);
        this.router.post('/post', auth_middleware_1.authMiddleware.checkAuthentication, create_post_1.Create.prototype.post);
        this.router.post('/post/image/post', auth_middleware_1.authMiddleware.checkAuthentication, create_post_1.Create.prototype.postWithImage);
        this.router.post('/post/video/post', auth_middleware_1.authMiddleware.checkAuthentication, create_post_1.Create.prototype.postWithVideo);
        this.router.put('/post/:postId', auth_middleware_1.authMiddleware.checkAuthentication, update_post_1.Update.prototype.posts);
        this.router.put('/post/image/:postId', auth_middleware_1.authMiddleware.checkAuthentication, update_post_1.Update.prototype.postWithImage);
        this.router.put('/post/video/:postId', auth_middleware_1.authMiddleware.checkAuthentication, update_post_1.Update.prototype.postWithVideo);
        this.router.delete('/post/:postId', auth_middleware_1.authMiddleware.checkAuthentication, delete_post_1.Delete.prototype.post);
        return this.router;
    }
}
exports.PostRoutes = PostRoutes;
exports.postRoutes = new PostRoutes();
//# sourceMappingURL=postRoutes.js.map