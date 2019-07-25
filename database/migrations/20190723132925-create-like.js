
/* eslint-disable no-unused-vars */
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Likes', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    userId: {
      allowNull: false,
      type: Sequelize.INTEGER,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    articleId: {
      type: Sequelize.INTEGER,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      references: {
        model: 'Articles',
        key: 'id',
      },
    },
    commentId: {
      type: Sequelize.INTEGER,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      references: {
        model: 'Comments',
        key: 'id',
      },
    },
    likedOn: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    }
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Likes')
};
