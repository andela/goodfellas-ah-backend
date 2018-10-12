'use strict';
module.exports = (sequelize, DataTypes) => {
  const CommentReply = sequelize.define('CommentReply', {
    body: DataTypes.STRING
  }, {});
  CommentReply.associate = function(models) {
    // associations can be defined here
  };
  return CommentReply;
};