'use strict';
module.exports = (sequelize, DataTypes) => {
  const BlacklistedToken = sequelize.define('BlacklistedToken', {
    token: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {});
  BlacklistedToken.associate = function(models) {
    // associations can be defined here
  };
  return BlacklistedToken;
};