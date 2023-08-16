import { Router } from 'express';
import { createAuthRouter } from './authRouter';
import { createUserRouter } from './userRouter';
import { authenticate } from '../middlewares/auth';

export const createBaseRouter = () => {
    const baseRouter = Router();

    baseRouter.use('/auth', createAuthRouter());
    baseRouter.use('/user', createUserRouter());

    return baseRouter;
};
