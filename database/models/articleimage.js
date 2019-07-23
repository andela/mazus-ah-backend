'use strict';
module.exports = (sequelize, DataTypes) => {
  const ArticleImage = sequelize.define('ArticleImage', {
    imageLink: DataTypes.STRING,
    articleId: DataTypes.INTEGER
  }, {});
  ArticleImage.associate = function(models) {
    // associations can be defined here
  };
  return ArticleImage;
};