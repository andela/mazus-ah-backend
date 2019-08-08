
module.exports = (sequelize, DataTypes) => {
  const Article = sequelize.define(
    'Article',
    {
      title: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      slug: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true,
      },
      body: {
        allowNull: false,
        type: DataTypes.TEXT,
      },
      description: {
        allowNull: false,
        type: DataTypes.TEXT,
      },
      isPaid: {
        defaultValue: false,
        type: DataTypes.BOOLEAN,
      },
      ratings: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      likes: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      dislikes: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      status: {
        allowNull: false,
        type: DataTypes.ENUM('draft', 'published', 'trash'),
        defaultValue: 'draft',
      },
      tagsList: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
      },
      userId: {
        allowNull: false,
        type: DataTypes.UUID,
      },
      readTime: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      readCount: {
        allowNull: false,
        type: DataTypes.INTEGER,
        defaultValue: '0',
      },
    },
    {},
  );
  Article.associate = (models) => {
    Article.hasMany(models.ArticleImage, {
      foreignKey: 'articleId',
      as: 'articleimage',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    Article.hasMany(models.Bookmark, {
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
    Article.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'author',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };
  return Article;
};
