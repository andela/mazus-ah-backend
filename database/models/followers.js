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
  Follower.associate = (models) => {
    Follower.belongsTo(models.User, {
      foreignKey: 'followerId',
      as: 'followings'
    });
  };
  return Follower;
};
