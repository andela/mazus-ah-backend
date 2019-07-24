/* eslint-disable space-before-function-paren */
/* eslint-disable no-unused-vars */
/* eslint-disable func-names */

module.exports = (sequelize, DataTypes) => {
  const Report = sequelize.define('Report', {
    reportTitle: {
      allowNull: false,
      type: DataTypes.STRING
    },
    reportBody: {
      allowNull: false,
      type: DataTypes.TEXT
    },
    reportedBy: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    articleId: {
      type: DataTypes.INTEGER
    },
    commentId: {
      type: DataTypes.INTEGER
    },
  }, {});
  Report.associate = function(models) {
    // associations can be defined here
  };
  return Report;
};
