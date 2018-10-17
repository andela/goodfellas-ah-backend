
module.exports = (sequelize, DataTypes) => {
  const ArticleComment = sequelize.define('ArticleComment', {
    body: DataTypes.STRING,
    article_slug: DataTypes.STRING,
    user_id: DataTypes.INTEGER
  }, {});
  ArticleComment.associate = (models) => {
    ArticleComment.hasMany(models.CommentReply, {
      foreignKey: 'comment_id'
    });
    ArticleComment.belongsTo(models.User, {
      foreignKey: 'user_id',
      sourceKey: 'user_id',
      as: 'user',
      onDelete: 'CASCADE',
    });
  };
  return ArticleComment;
};
