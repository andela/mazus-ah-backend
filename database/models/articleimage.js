/* eslint-disable space-before-function-paren */
/* eslint-disable no-unused-vars */
/* eslint-disable func-names */

module.exports = (sequelize, DataTypes) => {
  const ArticleImage = sequelize.define('ArticleImage', {
    imageLink: {
      allowNull: false,
      type: DataTypes.STRING
    },
    articleId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
  }, {});
  ArticleImage.associate = function(models) {
    // associations can be defined here
  };
  return ArticleImage;
};
