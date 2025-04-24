import { SocialScamNet } from '@root/setupServer';
import express, { Express } from 'express';
import DBConnect from '@root/setupDb';
import { config } from '@root/config';
import Logger from 'bunyan'
const log: Logger = config.createLogger('app');
class Application {

    public initialize() : void {
        this.loadConfig();
        DBConnect();
        const app : Express = express();
        const server = new SocialScamNet(app);
        server.start()
        Application.handleExit();
    }

    private loadConfig() : void {
        config.validateConfig();
        config.cloudinaryConfig();
    }


    private static handleExit(): void {
        process.on('uncaughtException', (error: Error) => {
            log.error(`There was an uncaught error: ${error}`);
            Application.shutDownProperly(1)
        });

        process.on('unhandleRejection', (reason: Error) => {
            log.error(`Unhandled rejection at promise: ${reason}`);
            Application.shutDownProperly(2);
        });

        process.on('SIGTERM', () => {
            log.error('Caught SIGTERM');
            Application.shutDownProperly(2);
        });

        process.on('SIGINT', () => {
            log.error('Caught SIGINT');
            Application.shutDownProperly(2);
        });

        process.on('exit', () => {
            log.error('Exiting');
        });
    }

    private static shutDownProperly(exitCode: number): void {
        Promise.resolve()
            .then(() => {
                log.info('Shutdown complete');
                process.exit(exitCode);
            })
            .catch((error) => {
                log.error(`Error during shutdown: ${error}`);
                process.exit(1);
            });
    }
}

const application: Application = new Application();
application.initialize();

// error note :
// -> i need update to the repository now