/* eslint-disable no-unused-vars */

module.exports = (sequelize, DataTypes) => {
  const Bookmark = sequelize.define('Bookmark', {
    userId: {
      allowNull: false,
      type: DataTypes.UUID,
    },
    articleId: {
      allowNull: false,
      type: DataTypes.UUID,
    },
  }, {});
  Bookmark.associate = (models) => {
    // associations can be defined here
  };
  return Bookmark;
};
