import { Router } from 'express';
import { createAuthRouter } from './authRouter';

export const createBaseRouter = () => {
    const baseRouter = Router();

    baseRouter.use('/auth', createAuthRouter());

    return baseRouter;
};
