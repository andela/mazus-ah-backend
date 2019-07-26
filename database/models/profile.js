/* eslint-disable space-before-function-paren */
/* eslint-disable no-unused-vars */
/* eslint-disable func-names */

module.exports = (sequelize, DataTypes) => {
  const Profile = sequelize.define('Profile', {
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    bio: DataTypes.STRING,
    avatar: DataTypes.STRING,
  }, {});
  Profile.associate = function(models) {
    // associations can be defined here
  };
  return Profile;
};
