'use strict';
module.exports = (sequelize, DataTypes) => {
  const Bookmark = sequelize.define('Bookmark', {
    userId: DataTypes.INTEGER,
    articleId: DataTypes.INTEGER
  }, {});
  Bookmark.associate = function(models) {
    // associations can be defined here
  };
  return Bookmark;
};