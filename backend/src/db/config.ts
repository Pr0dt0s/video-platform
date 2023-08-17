require('dotenv').config();

module.exports = {
    development: {
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRESS_DATABASE_DEVELOPMENT,
        host: process.env.POSTGRE_DEVELOPMENT_HOST,
        dialect: 'postgres',
    },
    test: {
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRESS_DATABASE_TEST,
        host: process.env.POSTGRE_TESTING_HOST,
        dialect: 'postgres',
    },
    production: {
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRESS_DATABASE_PRODUCTION,
        host: process.env.POSTGRE_PRODUCTION_HOST,
        dialect: 'postgres',
    },
};
