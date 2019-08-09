/* eslint-disable no-unused-vars */

module.exports = (sequelize, DataTypes) => {
  const Report = sequelize.define('Report', {
    reportTitle: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    reportBody: {
      allowNull: false,
      type: DataTypes.TEXT,
    },
    userId: {
      allowNull: false,
      type: DataTypes.UUID,
    },
    articleId: {
      allowNull: false,
      type: DataTypes.UUID,
    },
    commentId: {
      type: DataTypes.UUID,
    },
  }, {});
  Report.associate = (models) => {
    Report.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };
  return Report;
};
