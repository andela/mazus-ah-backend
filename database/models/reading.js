/* eslint-disable func-names */
module.exports = (sequelize, DataTypes) => {
  const Reading = sequelize.define('Reading', {
    userId: DataTypes.UUID,
    articleId: DataTypes.UUID,
  }, {});
  Reading.associate = function (models) {
    Reading.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'userdetails',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };
  return Reading;
};
