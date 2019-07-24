/* eslint-disable space-before-function-paren */
/* eslint-disable no-unused-vars */
/* eslint-disable func-names */

module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define('Like', {
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    articleId: {
      type: DataTypes.INTEGER
    },
    commentId: {
      type: DataTypes.INTEGER
    },
    likedOn: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.literal('CURRENT_TIMESTAMP'),
    }
  }, {});
  Like.associate = function(models) {
    // associations can be defined here
  };
  return Like;
};
