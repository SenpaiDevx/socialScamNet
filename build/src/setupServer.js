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
exports.SocialScamNet = void 0;
// reference error for global Error Handler -> https://stackoverflow.com/questions/65112240/express-typescript-route-properties
const express_1 = require("express");
const hpp_1 = __importDefault(require("hpp"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const helmet_1 = __importDefault(require("helmet"));
require("express-async-errors");
const socket_io_1 = require("socket.io");
const swagger_stats_1 = __importDefault(require("swagger-stats"));
const redis_1 = require("redis");
const config_1 = require("./config");
const compression_1 = __importDefault(require("compression"));
const cookie_session_1 = __importDefault(require("cookie-session"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const routes_1 = __importDefault(require("./routes"));
const post_1 = require("./shared/sockets/post");
const redis_adapter_1 = require("@socket.io/redis-adapter");
const error_handler_1 = require("./shared/globals/helpers/error-handler");
const follower_1 = require("./shared/sockets/follower");
const notification_1 = require("./shared/sockets/notification");
const image_1 = require("./shared/sockets/image");
const chat_1 = require("./shared/sockets/chat");
const user_1 = require("./shared/sockets/user");
const SERVER_PORT = 5000;
const log = config_1.config.createLogger('server');
class SocialScamNet {
    constructor(app) {
        this.app = app;
    }
    start() {
        this.securityMiddleware(this.app);
        this.standardMiddleware(this.app);
        this.routesMiddleware(this.app);
        this.globalErrorHandler(this.app);
        this.startServer(this.app);
        this.apiMonitoring(this.app);
    }
    securityMiddleware(app) {
        app.use((0, cookie_session_1.default)({
            name: 'session',
            keys: [config_1.config.SECRET_KEY_ONE, config_1.config.SECRET_KEY_TWO],
            maxAge: 24 * 7 * 360000,
            secure: config_1.config.NODE_ENV !== 'development',
        }));
        app.use((0, hpp_1.default)());
        app.use((0, helmet_1.default)());
        app.use((0, cors_1.default)({
            origin: config_1.config.CLIENT_URL,
            credentials: true,
            optionsSuccessStatus: 200,
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
        }));
    }
    standardMiddleware(app) {
        app.use((0, compression_1.default)());
        app.use((0, express_1.json)({ limit: '55mb' }));
        app.use((0, express_1.urlencoded)({ extended: true, limit: "50mb" }));
    }
    routesMiddleware(app) {
        (0, routes_1.default)(app);
    }
    apiMonitoring(app) {
        app.use(swagger_stats_1.default.getMiddleware({}));
    }
    globalErrorHandler(app) {
        return __awaiter(this, void 0, void 0, function* () {
            app.all('*', (req, res) => {
                res.status(http_status_codes_1.default.NOT_FOUND).json({ message: `${req.originalUrl} not found` });
            });
            app.use((error, req, res, next) => {
                if (error instanceof error_handler_1.CustomError) {
                    return res.status(error.statusCode).json(error.serializeErrors());
                }
                next();
            });
        });
    }
    startServer(app) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!config_1.config.JWT_TOKEN) {
                throw new Error('JWT Token is not set in config file');
            }
            try {
                const httpServer = new http_1.default.Server(app);
                const socketIO = yield this.createSocketIO(httpServer);
                this.startHttpServer(httpServer);
                this.socketIOConnections(socketIO);
            }
            catch (error) {
                log.error(error);
            }
        });
    }
    createSocketIO(httpServer) {
        return __awaiter(this, void 0, void 0, function* () {
            // redis and socket io adapters
            const io = new socket_io_1.Server(httpServer, {
                cors: {
                    origin: config_1.config.CLIENT_URL,
                    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
                }
            });
            const pubClient = (0, redis_1.createClient)({ url: config_1.config.REDIS_HOST });
            const subClient = pubClient.duplicate();
            yield Promise.all([pubClient, subClient]);
            io.adapter((0, redis_adapter_1.createAdapter)(pubClient, subClient));
            return io;
        });
    }
    startHttpServer(httpServer) {
        log.info(`Worker with process id of ${process.pid} has started...`);
        log.info(`Server has started with process ${process.pid}`);
        httpServer.listen(SERVER_PORT, () => {
            log.info(`Server running on port ${SERVER_PORT}`);
        });
    }
    socketIOConnections(io) {
        return __awaiter(this, void 0, void 0, function* () {
            const postSocketHandler = new post_1.SocketIOPostHandler(io);
            const followerSocketHandler = new follower_1.SocketIOFollowerHandler(io);
            const notificationSocketHandler = new notification_1.SocketIONotificationHandler();
            const imageSocketHandler = new image_1.SocketIOImageHandler();
            const chatSocketHandler = new chat_1.SocketIOChatHandler(io);
            const userSocketHandler = new user_1.SocketIOUserHandler(io);
            yield postSocketHandler.listen();
            yield followerSocketHandler.listen();
            yield notificationSocketHandler.listen(io);
            yield imageSocketHandler.listen(io);
            yield chatSocketHandler.listen();
            yield userSocketHandler.listen();
        });
    }
}
exports.SocialScamNet = SocialScamNet;
//# sourceMappingURL=setupServer.js.map