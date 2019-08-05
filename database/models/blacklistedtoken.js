/* eslint-disable no-unused-vars */

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
        type: DataTypes.UUID,
      },
    },
    {},
  );
  BlacklistedToken.associate = (models) => {
    // associations can be defined here
  };
  return BlacklistedToken;
};
