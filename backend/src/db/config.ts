require('dotenv').config();

module.exports = {
    development: {
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: 'development',
        host: process.env.POSTGRE_DEVELOPMENT_HOST,
        dialect: 'postgres',
    },
    test: {
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: 'test',
        host: process.env.POSTGRE_TESTING_HOST,
        dialect: 'postgres',
    },
    production: {
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: 'production',
        host: process.env.POSTGRE_PRODUCTION_HOST,
        dialect: 'postgres',
    },
};
