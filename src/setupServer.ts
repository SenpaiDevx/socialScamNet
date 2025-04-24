// reference error for global Error Handler -> https://stackoverflow.com/questions/65112240/express-typescript-route-properties
import express, { Application, json, urlencoded } from "express";
import hpp from "hpp";
import cors from "cors";
import http from "http";
import helmet from "helmet";
import Logger from "bunyan";
import 'express-async-errors';
import { Server } from 'socket.io';
import SwaggerStats from 'swagger-stats';
import { createClient } from 'redis';
import { config } from "@root/config";
import compression from "compression";
import cookieSession from "cookie-session";
import HTTP_STATUS from "http-status-codes";
import applicationRoutes from "@root/routes";
import { SocketIOPostHandler } from "@socket/post";
import { createAdapter } from '@socket.io/redis-adapter';
import { CustomError, IErrorResponse } from "@global/helpers/error-handler";
import { SocketIOFollowerHandler } from "@socket/follower";
import { SocketIONotificationHandler } from "@socket/notification";
import { SocketIOImageHandler } from "@socket/image";
import { SocketIOChatHandler } from "@socket/chat";
import { SocketIOUserHandler } from "@socket/user";
const SERVER_PORT: number = 5000;
const log: Logger = config.createLogger('server')

export class SocialScamNet {
    private app: Application;

    constructor(app: Application) {
        this.app = app;
    }

    public start(): void {
        this.securityMiddleware(this.app);
        this.standardMiddleware(this.app);
        this.routesMiddleware(this.app);
        this.globalErrorHandler(this.app);
        this.startServer(this.app);
        this.apiMonitoring(this.app);
    }

    private securityMiddleware(app: Application): void {
        app.use(
            cookieSession({
                name: 'session',
                keys: [config.SECRET_KEY_ONE!, config.SECRET_KEY_TWO!],
                maxAge: 24 * 7 * 360000,
                secure: config.NODE_ENV !== 'development',
            })
        )

        app.use(hpp());
        app.use(helmet());
        app.use(cors({
            origin: config.CLIENT_URL,
            credentials: true,
            optionsSuccessStatus: 200,
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
        }))
    }

    private standardMiddleware(app: Application): void {
        app.use(compression());
        app.use(json({ limit: '55mb' }))
        app.use(urlencoded({ extended: true, limit: "50mb" }))
    }

    private routesMiddleware(app: Application): void {
        applicationRoutes(app)
    }

    private apiMonitoring (app : Application) : void {
        app.use(SwaggerStats.getMiddleware({}))
     
    }

    private async globalErrorHandler(app: Application): Promise<void> {
        
        app.all('*', (req: express.Request, res: express.Response) => {
            res.status(HTTP_STATUS.NOT_FOUND).json({ message: `${req.originalUrl} not found` });
        });

        app.use((error: IErrorResponse, req: express.Request, res: express.Response, next: express.NextFunction) => {
            if (error instanceof CustomError) {
                return res.status(error.statusCode).json(error.serializeErrors());
            }
            next();
        });
    }

    private async startServer(app: Application): Promise<void> {
        if (!config.JWT_TOKEN) {
            throw new Error('JWT Token is not set in config file')
        }

        try {
            const httpServer: http.Server = new http.Server(app);
            const socketIO: Server = await this.createSocketIO(httpServer);
            this.startHttpServer(httpServer);
            this.socketIOConnections(socketIO);
        } catch (error) {
            log.error(error);
        }
    }

    private async createSocketIO(httpServer: http.Server): Promise<Server> {
        // redis and socket io adapters
        const io: Server = new Server(httpServer, {
            cors: {
                origin: config.CLIENT_URL,
                methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
            }
        });

        const pubClient = createClient({ url: config.REDIS_HOST });
        const subClient = pubClient.duplicate();
        await Promise.all([pubClient, subClient]);
        io.adapter(createAdapter(pubClient, subClient));
        return io;
    }

    private startHttpServer(httpServer: http.Server): void {
        log.info(`Worker with process id of ${process.pid} has started...`);
        log.info(`Server has started with process ${process.pid}`);
        httpServer.listen(SERVER_PORT, () => {
            log.info(`Server running on port ${SERVER_PORT}`);
        });
    }

    private async socketIOConnections(io: Server): Promise<void> {
        const postSocketHandler : SocketIOPostHandler = new SocketIOPostHandler(io);
        const followerSocketHandler: SocketIOFollowerHandler = new SocketIOFollowerHandler(io);
        const notificationSocketHandler: SocketIONotificationHandler = new SocketIONotificationHandler();
        const imageSocketHandler: SocketIOImageHandler = new SocketIOImageHandler();
        const chatSocketHandler: SocketIOChatHandler = new SocketIOChatHandler(io);
        const userSocketHandler: SocketIOUserHandler = new SocketIOUserHandler(io);

        await postSocketHandler.listen();
        await followerSocketHandler.listen();
        await notificationSocketHandler.listen(io);
        await imageSocketHandler.listen(io);
        await chatSocketHandler.listen();
        await userSocketHandler.listen();
      }


}