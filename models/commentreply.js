

module.exports = (sequelize, DataTypes) => {
  const CommentReply = sequelize.define('CommentReply', {
    body: DataTypes.STRING,
    comment_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER
  }, {});
  CommentReply.associate = (models) => {
    CommentReply.belongsTo(models.User, { as: 'user' });
    CommentReply.belongsTo(models.ArticleComment, { as: 'article' });
  };
  return CommentReply;
};
