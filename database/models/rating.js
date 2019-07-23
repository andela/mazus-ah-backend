'use strict';
module.exports = (sequelize, DataTypes) => {
  const Rating = sequelize.define('Rating', {
    rate: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    articleId: DataTypes.INTEGER
  }, {});
  Rating.associate = function(models) {
    // associations can be defined here
  };
  return Rating;
};