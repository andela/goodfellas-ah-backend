'use strict';
module.exports = (sequelize, DataTypes) => {
  const ReportArticle = sequelize.define('ReportArticle', {
    articleId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    authorId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    reporterId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    violation: {
      type: DataTypes.TEXT,
      defaultValue: true
    },
  }, {});
  ReportArticle.associate = (models) => {
    // associations can be defined here
  };
  return ReportArticle;
};