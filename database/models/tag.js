/* eslint-disable no-unused-vars */

module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define('Tag', {
    name: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    articleId: {
      allowNull: false,
      type: DataTypes.UUID,
    },
  }, {});
  Tag.associate = (models) => {
    // associations can be defined here
  };
  return Tag;
};
