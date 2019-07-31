/* eslint-disable no-unused-vars */
/* eslint-disable arrow-body-style */
/* eslint-disable object-shorthand */
/* eslint-disable func-names */


module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
      .then(() => {
        return queryInterface.createTable('Articles', {
          id: {
            allowNull: false,
            primaryKey: true,
            type: Sequelize.DataTypes.UUID,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
          },
          title: {
            allowNull: false,
            type: Sequelize.STRING,
          },
          slug: {
            allowNull: false,
            type: Sequelize.STRING,
          },
          body: {
            allowNull: false,
            type: Sequelize.TEXT,
          },
          description: {
            allowNull: false,
            type: Sequelize.TEXT,
          },
          isPaid: {
            defaultValue: false,
            type: Sequelize.BOOLEAN,
          },
          ratings: {
            type: Sequelize.INTEGER,
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
          readTime: {
            allowNull: false,
            type: Sequelize.INTEGER,
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
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Articles')
};
