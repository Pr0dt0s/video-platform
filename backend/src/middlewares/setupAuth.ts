import { Application } from 'express';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { UUID } from 'crypto';
import session from 'express-session';
import User from '../models/user';

// TODO: change to database query
const queryUserByEmail: (email: string) => Promise<User | null> = (email) => {
    return User.findOne({
        where: {
            email: email,
        },
    });
};

export const setupAuthentication = (app: Application) => {
    app.use(
        session({
            secret: process.env.JWT_PASSWORD,
            resave: false,
            saveUninitialized: false,
        })
    );
    app.use(passport.initialize({}));

    passport.serializeUser((user, done) => {
        done(null, user.email);
    });

    passport.use(
        new LocalStrategy(
            { usernameField: 'email', session: false },
            async (email, password, done) => {
                const user = await queryUserByEmail(email);
                if (!user) return done(null, false);
                if (!(await user.validatePassword(password)))
                    return done(null, false);
                return done(null, {
                    id: user.getDataValue('id'),
                    email: user.getDataValue('email'),
                    name: user.getDataValue('name'),
                });
            }
        )
    );

    passport.use(
        new JwtStrategy(
            {
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                secretOrKey: process.env.JWT_PASSWORD,
            },
            async (payload, done) => {
                if ('email' in payload) {
                    const user = await User.findOne({
                        where: {
                            email: payload['email'],
                        },
                    });
                    if (!user) {
                        return done(
                            `No user found for email ${payload['email']}`
                        );
                    }
                    return done(null, {
                        id: user.getDataValue('id'),
                        email: user.getDataValue('email'),
                        name: user.getDataValue('name'),
                    });
                }
                return done(null, false);
            }
        )
    );
};
