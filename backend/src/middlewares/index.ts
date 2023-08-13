import express, { Application } from 'express';
import requestLogger from './requestLogger';
import helmet from 'helmet';
import cors from 'cors';

export const setUpMiddleWares = (app: Application) => {
    //seccurity
    app.use(helmet({}));
    app.use(
        cors({
            origin:
                process.env.NODE_ENV === 'development' ||
                process.env.NODE_ENV === 'test'
                    ? '*'
                    : 'same-origin',
        })
    );
    //functionality
    requestLogger(app);
    app.use(express.json());
};
