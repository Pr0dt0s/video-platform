import { Router } from 'express';

export const createUserRouter = () => {
    const userRouter = Router();

    userRouter.post('/signUp');

    return userRouter;
};
