/* eslint-disable space-before-function-paren */
/* eslint-disable no-unused-vars */
/* eslint-disable func-names */

module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define('Tag', {
    name: {
      allowNull: false,
      type: DataTypes.STRING
    },
    articleId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
  }, {});
  Tag.associate = function(models) {
    // associations can be defined here
  };
  return Tag;
};
