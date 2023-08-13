import express, { Application } from 'express';
import requestLogger from './requestLogger';

export const setUpMiddleWares = (app: Application) => {
    app.use(express.json());
    requestLogger(app);
};
