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
  }, {});
  Like.associate = (models) => {
    // associations can be defined here
  };
  return Like;
};
