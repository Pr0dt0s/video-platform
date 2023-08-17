import request from 'supertest';

process.env.NODE_ENV = 'development';

import Server from '../src';
import { Application } from 'express';
import { Video } from '../src/models/video';
import { generateAccessTokens } from '../src/routes/authRouter';
import { sequelize } from '../src/models/_db';

let server = new Server(12123);
let app: Application = server.app;

beforeAll((done) => {
    sequelize.sync().then(() => done());
});

beforeAll((done) => {
    server.stop();
    server.start(done);
});

let createdVideos: Video[];

beforeAll((done) => {
    new Promise<void>(async (resolve, reject) => {
        try {
            await Video.destroy({
                force: true,
                cascade: true,
                truncate: true,
            }).then(done);
            createdVideos = await Video.bulkCreate(
                testVideos.map((video) => ({
                    //@ts-ignore
                    ...video,
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

const testVideos = [];

describe('Videos api', () => {
    it('Creates new videos', () => {
        expect(1).toBe(0);
    });

    it.skip('Publishes videos', () => {});

    it.skip('Unpublishes videos', () => {});

    it.skip('Lists videos', () => {});

    it.skip('Like videos', () => {});

    it.skip("Lists video's details", () => {});

    it.skip('Follow Creator', () => {});

    it.skip('Edit Videos', () => {});
});
