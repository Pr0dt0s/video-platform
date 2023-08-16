import express, { Application } from 'express';
import dotenv from 'dotenv';
import { setUpMiddleWares } from './middlewares';
import { createBaseRouter } from './routes';
import http from 'http';

export * from './models/index';

dotenv.config();

class Server {
    app: Application;
    _server: http.Server;

    constructor(private port: number) {
        this.app = express();

        setUpMiddleWares(this.app);

        this.app.use('/api/v1', createBaseRouter());
    }

    start(callback?: () => void) {
        this._server = this.app.listen(this.port, () => {
            console.log(`Server is listening on port ${this.port}`);
            if (callback) callback();
        });
    }

    stop() {
        this._server?.close();
    }
}

if (require.main === module) {
    const server = new Server(Number(process.env.PORT || 3000));
    server.start();
}

export default Server;
