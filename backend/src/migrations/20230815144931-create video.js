'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        queryInterface.createTable('users', {
            id: {
                type: Sequelize.UUIDV4,
                allowNull: false,
                primaryKey: true,
            },
            url: Sequelize.STRING,
            description: Sequelize.STRING,
            published: Sequelize.BOOLEAN,
            owner: {
                type: Sequelize.UUIDV4,
                references: {
                    model: 'User',
                    key: 'id',
                },
            },
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
