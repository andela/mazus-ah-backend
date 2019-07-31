
/* eslint-disable no-unused-vars */
/* eslint-disable arrow-body-style */
/* eslint-disable object-shorthand */
/* eslint-disable func-names */

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
      .then(() => {
        return queryInterface.createTable('Profiles', {
          id: {
            allowNull: false,
            primaryKey: true,
            type: Sequelize.DataTypes.UUID,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
          },
          userId: {
            allowNull: false,
            type: Sequelize.DataTypes.UUID,
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
            references: {
              model: 'Users',
              key: 'id',
            },
          },
          bio: {
            type: Sequelize.STRING,
          },
          avatar: {
            type: Sequelize.STRING,
          },
          createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
          },
          updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
          },
        });
      });
  },
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Profiles')
};
