module.exports = (sequelize, DataTypes) => {
  const CommentReaction = sequelize.define('CommentReaction', {
    user_id: DataTypes.INTEGER,
    comment_id: DataTypes.INTEGER,
    reaction: DataTypes.INTEGER
  }, {});
  CommentReaction.associate = (models) => {
    CommentReaction.belongsTo(models.User, {
      foreignKey: 'user_id',
      sourceKey: 'user_id',
      as: 'user',
      onDelete: 'CASCADE',
    });
    CommentReaction.belongsTo(models.ArticleComment.User, {
      foreignKey: 'article_id',
      sourceKey: 'article_id',
      as: 'article',
      onDelete: 'CASCADE',
    });
  };
  return CommentReaction;
};
