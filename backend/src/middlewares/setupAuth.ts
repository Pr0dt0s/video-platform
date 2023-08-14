import { Application } from 'express';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { UUID } from 'crypto';
import session from 'express-session';

// TODO: move to Model/DTO
type User = {
    email: string;
    password: string;
    id: UUID;
};

// TODO: change to database query
const queryUserByEmail: (email: string) => Promise<User | null> = (
    email: string
) => {
    return Promise.resolve({
        email,
        password: 'temporary',
        id: '1-2-3-4-5',
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
                if (user.password != password) return done(null, false);
                return done(null, { email: user.email, id: user.id });
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
                    const user = await queryUserByEmail(payload['email']);
                    return done(null, { email: user.email, id: user.id });
                }
                return done(null, false);
            }
        )
    );
};
