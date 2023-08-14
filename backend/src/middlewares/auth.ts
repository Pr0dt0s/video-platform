import { Handler } from 'express';
import passport from 'passport';

export const authenticate = (
    strategy: 'local' | 'jwt' = 'jwt',
    failureRedirect?: string
) => {
    return passport.authenticate(strategy, { failureRedirect });
};
