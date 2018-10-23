import eventEmitter from '../lib/eventEmitter';

module.exports = (sequelize, DataTypes) => {
  const ArticleComment = sequelize.define('ArticleComment', {
    body: DataTypes.STRING,
    pageId: DataTypes.STRING,
    highlight: DataTypes.STRING,
    startIndex: DataTypes.INTEGER,
    endIndex: DataTypes.INTEGER,
    article_slug: DataTypes.STRING,
    user_id: DataTypes.INTEGER
  },
  {
    hooks: {
      afterCreate(comment) {
        eventEmitter.emit('comment created', comment);
      }
    }
  });
  ArticleComment.associate = (models) => {
    ArticleComment.hasMany(models.CommentReply, {
      foreignKey: 'comment_id'
    });
    ArticleComment.hasMany(models.CommentReaction, {
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
