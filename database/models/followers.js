/* eslint-disable space-before-function-paren */
/* eslint-disable no-unused-vars */
/* eslint-disable func-names */

module.exports = (sequelize, DataTypes) => {
  const Follower = sequelize.define('Follower', {
    followerId: {
      allowNull: false,
      type: DataTypes.UUID,
    },
    userId: {
      allowNull: false,
      type: DataTypes.UUID,
    },
  }, {});
  Follower.associate = function(models) {
    // associations can be defined here
  };
  return Follower;
};
