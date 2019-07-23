'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    verificationToken: DataTypes.STRING,
    isVerified: DataTypes.BOOLEAN,
    type: DataTypes.STRING
  }, {});
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
      through: 'followers',
      timestamps: false,
    });
    User.belongsToMany(models.User, {
      foreignKey: 'followerId',
      otherKey: 'userId',
      as: 'followings',
      through: 'followers',
      timestamps: false,
    });
  };
  return User;
};