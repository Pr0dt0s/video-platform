import request from 'supertest';
import Server from '../src';
import { Application } from 'express';

let server = new Server(12121);
let app: Application = server.app;

describe('Api', () => {
    describe('Users/Creators api', () => {
        beforeAll((done) => {
            server.stop();
            server.start(done);
        });

        it('Can Sign Up User', (done) => {
            request(app)
                .post('/api/v1/users/create')
                .send({
                    name: 'Frodo',
                    email: 'a@b.c',
                    password: 'temporario',
                })
                .accept('application/json')
                .expect(200)
                .end((error, response) => {
                    if (error) return done(error);
                    expect(response.body).toHaveProperty('token');
                    expect(response.body).toHaveProperty('refreshToken');
                    done();
                });
        });

        it('Can Sign In User', (done) => {
            request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: 'a@b.c',
                    password: 'temporary',
                })
                .expect(200)
                .end((error, response) => {
                    if (error) return done(error);
                    expect(response.body).toHaveProperty('token');
                    expect(response.body).toHaveProperty('refreshToken');
                    done();
                });
        });

        it.skip('Lists profile information', () => {});

        it.skip('Follow Creator', () => {});

        it.skip('Unfollow Creator', () => {});
    });

    describe('Videos api', () => {
        beforeAll(() => {});

        it.skip('Creates new videos', () => {});

        it.skip('Publishes videos', () => {});

        it.skip('Unpublishes videos', () => {});

        it.skip('Lists videos', () => {});

        it.skip('Like videos', () => {});

        it.skip("Lists video's details", () => {});

        it.skip('Follow Creator', () => {});

        it.skip('Edit Videos', () => {});
    });
});
