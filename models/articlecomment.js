
module.exports = (sequelize, DataTypes) => {
  const ArticleComment = sequelize.define('ArticleComment', {
    body: DataTypes.STRING,
    article_slug: DataTypes.STRING,
    user_id: DataTypes.INTEGER
  }, {});
  ArticleComment.associate = (models) => {
    ArticleComment.belongsTo(models.User, { as: 'user' });
    ArticleComment.hasMany(models.CommentReply, {
      foreignKey: 'article_id'
    });
  };
  return ArticleComment;
};
