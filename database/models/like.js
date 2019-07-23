'use strict';
module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define('Like', {
    userId: DataTypes.INTEGER,
    articleId: DataTypes.INTEGER,
    commentId: DataTypes.INTEGER,
    likedOn: DataTypes.DATE
  }, {});
  Like.associate = function(models) {
    // associations can be defined here
  };
  return Like;
};