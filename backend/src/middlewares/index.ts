import express, { Application } from 'express';
import requestLogger from './requestLogger';
import helmet from 'helmet';
import cors from 'cors';

import { setupAuthentication } from './setupAuth';

export const setUpMiddleWares = (app: Application) => {
    //security
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

    //Authentication/Authorization
    setupAuthentication(app);
};
