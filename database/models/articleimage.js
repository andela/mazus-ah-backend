/* eslint-disable no-unused-vars */

module.exports = (sequelize, DataTypes) => {
  const ArticleImage = sequelize.define('ArticleImage', {
    imageLink: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    articleId: {
      allowNull: false,
      type: DataTypes.UUID,
    },
  }, {});
  ArticleImage.associate = (models) => {
    // associations can be defined here
  };
  return ArticleImage;
};
