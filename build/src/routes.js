"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authRoutes_1 = require("./features/auth/routes/authRoutes");
const auth_middleware_1 = require("./shared/globals/helpers/auth-middleware");
const currentRoutes_1 = require("./features/auth/routes/currentRoutes");
const postRoutes_1 = require("./features/post/routes/postRoutes");
const base_queue_1 = require("./shared/services/queues/base.queue");
const reactionRoutes_1 = require("./features/reactions/routes/reactionRoutes");
const commentRoutes_1 = require("./features/comments/routes/commentRoutes");
const followerRoutes_1 = require("./features/followers/routes/followerRoutes");
const notificationRoutes_1 = require("./features/notifications/routes/notificationRoutes");
const imageRoutes_1 = require("./features/images/routes/imageRoutes");
const chatRoutes_1 = require("./features/chat/routes/chatRoutes");
const userRoutes_1 = require("./features/user/routes/userRoutes");
const healthRoutes_1 = require("./features/user/routes/healthRoutes");
const BASE_PATH = '/api/v1';
exports.default = (app) => {
    const routes = () => {
        app.use('/queues', base_queue_1.serverAdapter.getRouter());
        app.use('', healthRoutes_1.healthRoutes.health());
        app.use('', healthRoutes_1.healthRoutes.env());
        app.use('', healthRoutes_1.healthRoutes.instance());
        app.use('', healthRoutes_1.healthRoutes.fiboRoutes());
        app.use(BASE_PATH, authRoutes_1.authRoutes.routes());
        app.use(BASE_PATH, authRoutes_1.authRoutes.signoutRoute());
        app.use(BASE_PATH, auth_middleware_1.authMiddleware.verifyUser, currentRoutes_1.currentUserRoutes.routes());
        app.use(BASE_PATH, auth_middleware_1.authMiddleware.verifyUser, postRoutes_1.postRoutes.routes());
        app.use(BASE_PATH, auth_middleware_1.authMiddleware.verifyUser, reactionRoutes_1.reactionRoutes.routes());
        app.use(BASE_PATH, auth_middleware_1.authMiddleware.verifyUser, commentRoutes_1.commentRoutes.routes());
        app.use(BASE_PATH, auth_middleware_1.authMiddleware.verifyUser, followerRoutes_1.followerRoutes.routes());
        app.use(BASE_PATH, auth_middleware_1.authMiddleware.verifyUser, notificationRoutes_1.notificationRoutes.routes());
        app.use(BASE_PATH, auth_middleware_1.authMiddleware.verifyUser, imageRoutes_1.imageRoutes.routes());
        app.use(BASE_PATH, auth_middleware_1.authMiddleware.verifyUser, chatRoutes_1.chatRoutes.routes());
        app.use(BASE_PATH, auth_middleware_1.authMiddleware.verifyUser, userRoutes_1.userRoutes.routes());
    };
    routes();
};
//# sourceMappingURL=routes.js.map