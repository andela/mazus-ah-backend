module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    body: {
      allowNull: false,
      type: DataTypes.TEXT,
    },
    userId: {
      allowNull: false,
      type: DataTypes.UUID,
    },
    articleId: {
      allowNull: false,
      type: DataTypes.UUID,
    },
    articleSlug: {
      type: DataTypes.STRING,
    },
    type: {
      allowNull: false,
      type: DataTypes.STRING,
      defaultValue: 'parent',
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    containsHighlightedText: {
      allowNull: true,
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    highlightedText: {
      allowNull: true,
      type: DataTypes.TEXT,
    },
  }, {});
  Comment.associate = (models) => {
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
    });
    Comment.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
    Comment.belongsToMany(models.Comment, {
      foreignKey: 'commentId',
      otherKey: 'subcommentId',
      as: 'childComments',
      through: 'CommentThread',
      timestamps: false,
    });
    Comment.belongsToMany(models.Comment, {
      foreignKey: 'subcommentId',
      otherKey: 'commentId',
      as: 'parentComments',
      through: 'CommentThread',
      timestamps: false,
    });
  };
  return Comment;
};
