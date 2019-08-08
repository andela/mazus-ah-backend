/* eslint-disable func-names */
/* eslint-disable space-before-function-paren */
/* eslint-disable semi */
module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
    payload: {
      allowNull: false,
      type: DataTypes.JSON,
    },
    read: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
    },
    receiverId: {
      allowNull: false,
      type: DataTypes.UUID,
    },
    type: {
      allowNull: false,
      type: DataTypes.STRING,
    }
  }, {});
  Notification.associate = function(models) {
    // associations can be defined here
    Notification.belongsTo(models.User, {
      foreignKey: 'receiverId',
    })
  };
  return Notification;
};
