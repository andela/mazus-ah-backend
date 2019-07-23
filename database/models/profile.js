'use strict';
module.exports = (sequelize, DataTypes) => {
  const Profile = sequelize.define('Profile', {
    userId: DataTypes.INTEGER,
    bio: DataTypes.STRING,
    avatar: DataTypes.STRING
  }, {});
  Profile.associate = function(models) {
    // associations can be defined here
  };
  return Profile;
};