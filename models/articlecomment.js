'use strict';
module.exports = (sequelize, DataTypes) => {
  const ArticleComment = sequelize.define('ArticleComment', {
    body: DataTypes.STRING
  }, {});
  ArticleComment.associate = function(models) {
    // associations can be defined here
  };
  return ArticleComment;
};