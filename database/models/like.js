/* eslint-disable no-unused-vars */

module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define('Like', {
    userId: {
      allowNull: false,
      type: DataTypes.UUID,
    },
    articleId: {
      type: DataTypes.UUID,
    },
    commentId: {
      type: DataTypes.UUID,
    },
    like: {
      type: DataTypes.BOOLEAN,
    },
  }, {});
  Like.associate = (models) => {
    // associations can be defined here
    Like.belongsTo(models.Comment, {
      foreignKey: 'commentId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };
  return Like;
};
