/* eslint-disable no-unused-vars */

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
    .then(() => queryInterface.createTable('CommentThread', {
      commentId: {
        allowNull: false,
        type: Sequelize.DataTypes.UUID,
      },
      subcommentId: {
        allowNull: false,
        type: Sequelize.DataTypes.UUID,
      },
    })),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('CommentThread')
};
