/* eslint-disable no-unused-vars */

module.exports = (sequelize, DataTypes) => {
  const Profile = sequelize.define('Profile', {
    userId: {
      allowNull: false,
      type: DataTypes.UUID,
    },
    bio: DataTypes.STRING,
    avatar: DataTypes.STRING,
  }, {});
  Profile.associate = (models) => {
    // associations can be defined here
  };
  return Profile;
};
