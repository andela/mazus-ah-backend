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
    reportedBy: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    articleId: {
      type: DataTypes.UUID,
    },
    commentId: {
      type: DataTypes.UUID,
    },
  }, {});
  Report.associate = (models) => {
    // associations can be defined here
  };
  return Report;
};
