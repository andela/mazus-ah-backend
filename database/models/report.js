'use strict';
module.exports = (sequelize, DataTypes) => {
  const Report = sequelize.define('Report', {
    reportTitle: DataTypes.STRING,
    reportBody: DataTypes.STRING,
    reportedBy: DataTypes.INTEGER,
    articleId: DataTypes.INTEGER,
    commentId: DataTypes.INTEGER
  }, {});
  Report.associate = function(models) {
    // associations can be defined here
  };
  return Report;
};