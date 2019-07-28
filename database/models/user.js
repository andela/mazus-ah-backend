/* eslint-disable space-before-function-paren */
/* eslint-disable no-unused-vars */
/* eslint-disable func-names */

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      email: {
        type: DataTypes.STRING,
        required: true,
        unique: true,
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      firstName: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      lastName: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      verificationToken: DataTypes.STRING,

      isVerified: {
        defaultValue: false,
        type: DataTypes.BOOLEAN,
      },
      type: {
        type: DataTypes.ENUM('admin', 'user'),
        defaultValue: 'user',
      },
    },
    {},
  );
  User.associate = function(models) {
    User.hasOne(models.Profile, {
      foreignKey: 'userId',
      as: 'profile',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    User.hasMany(models.Article, {
      foreignKey: 'userId',
      as: 'articles',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    User.hasMany(models.Bookmark, {
      foreignKey: 'userId',
      as: 'bookmarks',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    User.hasMany(models.Comment, {
      foreignKey: 'userId',
      as: 'usercomment',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    User.hasMany(models.Like, {
      foreignKey: 'userId',
      as: 'userlikes',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    User.hasMany(models.Rating, {
      foreignKey: 'userId',
      as: 'userrating',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    User.hasMany(models.Report, {
      foreignKey: 'userId',
      as: 'userreport',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    User.belongsToMany(models.User, {
      foreignKey: 'userId',
      otherKey: 'followerId',
      as: 'followers',
      through: 'Followers',
      timestamps: false,
    });
    User.belongsToMany(models.User, {
      foreignKey: 'followerId',
      otherKey: 'userId',
      as: 'followings',
      through: 'Followers',
      timestamps: false,
    });
  };
  return User;
};
