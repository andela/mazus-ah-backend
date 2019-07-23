'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('reports', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      reportTitle: {
        type: Sequelize.STRING
      },
      reportBody: {
        type: Sequelize.STRING
      },
      reportedBy:{
        type: Sequelize.INTEGER
      },
      articleId:{
        type: Sequelize.INTEGER
      },
      commentId:{
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('reports');
  }
};