/* eslint-disable import/no-dynamic-require */
import Sequelize from 'sequelize';
import path from 'path';

export type { Sequelize } from 'sequelize';

const env = process.env.NODE_ENV || 'development';
const config = require(path.join(`${__dirname}/../db/config`))[env];

export const sequelize = new Sequelize.Sequelize(
    config.database,
    config.username,
    config.password,
    {
        ...config,
        logQueryParameters: true,
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
    }
);
