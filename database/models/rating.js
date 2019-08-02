module.exports = (sequelize, DataTypes) => {
  const Rating = sequelize.define('Rating', {
    rate: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    userId: {
      allowNull: false,
      type: DataTypes.UUID,
    },
    articleId: {
      allowNull: false,
      type: DataTypes.UUID,
    },
  }, {});
  Rating.associate = (models) => {
    // associations can be defined here
    Rating.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'userdetails',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };
  return Rating;
};
