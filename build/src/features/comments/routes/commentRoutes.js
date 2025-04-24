"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../../../shared/globals/helpers/auth-middleware");
const get_comments_1 = require("../controllers/get-comments");
const add_comment_1 = require("../controllers/add-comment");
class CommentRoutes {
    constructor() {
        this.router = express_1.default.Router();
    }
    routes() {
        this.router.get('/post/comment/:postId', auth_middleware_1.authMiddleware.checkAuthentication, get_comments_1.Get.prototype.comments);
        this.router.get('/post/commentsnames/:postId', auth_middleware_1.authMiddleware.checkAuthentication, get_comments_1.Get.prototype.commentsNamesFromCache);
        this.router.get('/post/single/comment/:postId/:commentId', auth_middleware_1.authMiddleware.checkAuthentication, get_comments_1.Get.prototype.singleComment);
        this.router.post('/post/comment', auth_middleware_1.authMiddleware.checkAuthentication, add_comment_1.Add.prototype.comment);
        return this.router;
    }
}
exports.commentRoutes = new CommentRoutes();
//# sourceMappingURL=commentRoutes.js.map