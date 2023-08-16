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

describe('Users/Creators api', () => {
    it('Can Sign Up User', (done) => {
        request(app)
            .post('/api/v1/user')
            .send({
                ...testUsers[0],
                email: 'different_' + testUsers[0].email,
            })
            .accept('application/json')
            .expect(201)
            .end((error, response) => {
                if (error) return done(error);
                expect(response.body).toHaveProperty('accessToken');
                expect(response.body).toHaveProperty('refreshToken');
                expect(response.body).toHaveProperty('user');
                done();
            });
    });

    it('Can Sign In User', (done) => {
        request(app)
            .post('/api/v1/auth/login')
            .send(testUsers[0])
            .expect(200)
            .end((error, response) => {
                if (error) return done(error);
                expect(response.body).toHaveProperty('accessToken');
                expect(response.body).toHaveProperty('refreshToken');
                expect(response.body).toHaveProperty('user');
                done();
            });
    });

    it('Lists profile information', (done) => {
        const { accessToken } = generateAccessTokens(
            createdUsers[0].toExpressUser()
        );
        request(app)
            .get(`/api/v1/user/${createdUsers[0].get().id}`)
            .auth(accessToken, { type: 'bearer' })
            .accept('application/json')
            .expect(200)
            .end((error, response) => {
                if (error) return done(error);
                expect(response.body).toHaveProperty('id');
                expect(response.body).toHaveProperty('name');
                expect(response.body).toHaveProperty('email');
                expect(response.body).toHaveProperty('publishedVideos');
                expect(response.body).toHaveProperty('follows');
                expect(response.body).toHaveProperty('beingFollowedBy');
                done();
            });
    });

    it('Follow Creator', (done) => {
        const { accessToken } = generateAccessTokens(
            createdUsers[0].toExpressUser()
        );
        request(app)
            .post(`/api/v1/user/follow`)
            .auth(accessToken, { type: 'bearer' })
            .send({
                user: createdUsers[1].get().id,
            })
            .accept('application/json')
            .expect(200)
            .end((error, _response) => {
                if (error) {
                    console.log(_response.body);
                }
                done();
            });
    });

    it('Unfollow Creator', (done) => {
        const { accessToken } = generateAccessTokens(
            createdUsers[0].toExpressUser()
        );
        request(app)
            .post(`/api/v1/user/unfollow`)
            .auth(accessToken, { type: 'bearer' })
            .send({
                user: createdUsers[1].get().id,
            })
            .accept('application/json')
            .expect(200)
            .end((error, _response) => {
                if (error) {
                    console.log(_response.body);
                }
                done();
            });
    });
});
