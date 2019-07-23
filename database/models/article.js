'use strict';
module.exports = (sequelize, DataTypes) => {
  const Article = sequelize.define('Article', {
    title: DataTypes.STRING,
    slug: DataTypes.STRING,
    body: DataTypes.STRING,
    description: DataTypes.STRING,
    isPaid: DataTypes.BOOLEAN,
    ratings: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    readTime: DataTypes.INTEGER
  }, {});
  Article.associate = function(models) {
    Article.hasMany(models.ArticleImage, {
      foreignKey: 'articleId',
      as: 'articleimage',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    Article.hasMany(models.Bookmarks, {
      foreignKey: 'articleId',
      as: 'bookmark',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    Article.hasMany(models.Comment, {
      foreignKey: 'articleId',
      as: 'articlecomment',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    Article.hasMany(models.Like, {
      foreignKey: 'articleId',
      as: 'articlelike',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    Article.hasMany(models.Tag, {
      foreignKey: 'articleId',
      as: 'tags',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    Article.hasMany(models.Rating, {
      foreignKey: 'articleId',
      as: 'articlerating',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    Article.hasMany(models.Report, {
      foreignKey: 'articleId',
      as: 'articlereport',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };
  return Article;
};