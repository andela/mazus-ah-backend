/* eslint-disable space-before-function-paren */
/* eslint-disable no-unused-vars */
/* eslint-disable func-names */

module.exports = (sequelize, DataTypes) => {
  const Rating = sequelize.define('Rating', {
    rate: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    articleId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
  }, {});
  Rating.associate = function(models) {
    // associations can be defined here
  };
  return Rating;
};
