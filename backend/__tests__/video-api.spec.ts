import request from 'supertest';

process.env.NODE_ENV = 'development';

import Server from '../src';
import { Application } from 'express';
import User from '../src/models/user';
import { generateAccessTokens } from '../src/routes/authRouter';
import { sequelize } from '../src/models/_db';
import { UserCreateDTO } from '../src/dtos/user.dto';

let server = new Server(12121);
let app: Application = server.app;

beforeAll((done) => {
    sequelize.sync().then(() => done());
});

beforeAll((done) => {
    server.stop();
    server.start(done);
});

let createdUsers: User[];

beforeAll((done) => {
    new Promise<void>(async (resolve, reject) => {
        try {
            await User.destroy({
                force: true,
                cascade: true,
                truncate: true,
            }).then(done);
            createdUsers = await User.bulkCreate(
                testUsers.map((user) => ({
                    ...user,
                    newPassword: user.password,
                    confirmNewPassword: user.password,
                })),
                { individualHooks: true }
            );
            resolve();
        } catch (error) {
            done(error);
            reject();
        }
    });
});

const testUsers: UserCreateDTO[] = [
    {
        name: 'Frodo',
        email: 'a@b.com',
        password: 'asdQWE123!@#',
    },
    {
        name: 'Sam',
        email: 'b@b.com',
        password: 'asdQWE123!@#',
    },
    {
        name: 'Aragorn',
        email: 'c@b.com',
        password: 'asdQWE123!@#',
    },
    {
        name: 'Legolas',
        email: 'd@b.com',
        password: 'asdQWE123!@#',
    },
];

describe('Videos api', () => {
    it.skip('Creates new videos', () => {});

    it.skip('Publishes videos', () => {});

    it.skip('Unpublishes videos', () => {});

    it.skip('Lists videos', () => {});

    it.skip('Like videos', () => {});

    it.skip("Lists video's details", () => {});

    it.skip('Follow Creator', () => {});

    it.skip('Edit Videos', () => {});
});
