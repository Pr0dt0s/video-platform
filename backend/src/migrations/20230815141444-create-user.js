'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        queryInterface.createTable('users', {
            id: {
                type: Sequelize.STRING,
                allowNull: false,
                primaryKey: true,
                defaultValue: Sequelize.UUIDV4,
            },
            name: {
                type: Sequelize.STRING,
                validate: {
                    notEmpty: true,
                },
            },
            email: {
                type: Sequelize.STRING,
                validate: {
                    isEmail: true,
                },
                unique: true,
            },
            password: Sequelize.STRING,
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            deletedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Users');
    },
};
