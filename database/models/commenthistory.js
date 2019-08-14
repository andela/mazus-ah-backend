/* eslint-disable no-unused-vars */

module.exports = (sequelize, DataTypes) => {
  const CommentHistory = sequelize.define('CommentHistory', {
    commentId: {
      allowNull: false,
      type: DataTypes.UUID,
    },
    userId: {
      allowNull: false,
      type: DataTypes.UUID,
    },
    oldComment: {
      allowNull: false,
      type: DataTypes.TEXT,
    }
  }, {});
  CommentHistory.associate = (models) => {
    CommentHistory.belongsTo(models.Comment, {
      foreignKey: 'commentId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    CommentHistory.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
  };
  return CommentHistory;
};
