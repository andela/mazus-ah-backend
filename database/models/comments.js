'use strict';
module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    body: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    articleId: DataTypes.INTEGER
  }, {});
  Comment.associate = function(models) {
    Comment.hasMany(models.Like, {
      foreignKey: 'commentId',
      as: 'commentlike',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    Comment.hasMany(models.Report, {
      foreignKey: 'commentId',
      as: 'commentreport',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    })
  };
  return Comment;
};