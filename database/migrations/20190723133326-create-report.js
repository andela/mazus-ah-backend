/* eslint-disable no-unused-vars */


module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
    .then(() => queryInterface.createTable('Reports', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
      },
      reportTitle: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      reportBody: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      reportedBy: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      articleId: {
        type: Sequelize.DataTypes.UUID,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        references: {
          model: 'Articles',
          key: 'id',
        },
      },
      commentId: {
        type: Sequelize.DataTypes.UUID,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        references: {
          model: 'Comments',
          key: 'id',
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    })),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Reports')
};
