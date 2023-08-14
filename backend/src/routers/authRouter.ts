import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import { authenticate } from '../middlewares/auth';

const refreshTokens = new Map<string, string>();

const clearUserTokens = (email) => {
    refreshTokens.forEach((tokenEmail, oldToken) => {
        if (tokenEmail === email) {
            refreshTokens.delete(oldToken);
        }
    });
};

const generateTokens = (user: Express.User) => {
    const refreshToken = randomBytes(256).toString('base64');

    clearUserTokens(user.email);

    refreshTokens.set(refreshToken, user.email);
    setTimeout(
        () => {
            refreshTokens.delete(refreshToken);
        },
        24 * 3600 * 1000
    );

    return {
        accessToken: jwt.sign(user, process.env.JWT_PASSWORD, {
            expiresIn: '3m',
        }),
        refreshToken,
    };
};

export const createAuthRouter = () => {
    const authRouter = Router();

    authRouter.post('/login', authenticate('local'), (req, res) => {
        const { accessToken, refreshToken } = generateTokens(req.user);

        res.status(200).send({
            token: accessToken,
            refreshToken: refreshToken,
        });
    });

    authRouter.post('/logout', authenticate(), (req, res) => {
        clearUserTokens(req.user.email);

        res.status(200).send({
            message: 'User logged out.',
        });
    });

    authRouter.post('/refresh-token', authenticate(), (req, res) => {
        const notAuthorized = () =>
            res.status(401).send({ error: 'Not authorized' });
        if (!req.body.token) {
            return notAuthorized();
        }
        const email = refreshTokens.get(req.body.token);
        if (!email || email !== req.user.email) {
            return notAuthorized();
        }

        const { accessToken, refreshToken } = generateTokens(req.user);

        res.status(200).send({
            token: accessToken,
            refreshToken: refreshToken,
        });
    });

    return authRouter;
};
