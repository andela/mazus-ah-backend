/* eslint-disable space-before-function-paren */
/* eslint-disable no-unused-vars */
/* eslint-disable func-names */

module.exports = (sequelize, DataTypes) => {
  const BlacklistedToken = sequelize.define(
    'BlacklistedToken',
    {
      token: {
        allowNull: false,
        type: DataTypes.TEXT,
      },
      userId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
    },
    {},
  );
  BlacklistedToken.associate = function(models) {
    // associations can be defined here
  };
  return BlacklistedToken;
};
