import eventEmitter from '../lib/eventEmitter';

module.exports = (sequelize, DataTypes) => {
  const UserNotification = sequelize.define('UserNotification', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    authorId: {
      type: DataTypes.INTEGER
    },
    articleSlug: {
      type: DataTypes.STRING
    },
    commentId: {
      type: DataTypes.INTEGER
    },
    type: {
      type: DataTypes.ENUM,
      allowNull: false,
      values: ['followerArticle', 'favoriteArticleComment']
    },
    seen: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    hooks: {
      afterCreate(notification) {
        console.log('created');
        eventEmitter.emit('notification created', notification);
      },
      afterBulkCreate(notification) {
        console.log('created');
        eventEmitter.emit('notification created', notification);
      }
    }
  });
  UserNotification.associate = (models) => {
    UserNotification.belongsTo(models.User, {
      foreignKey: 'userId',
      sourceKey: 'userId',
      as: 'user',
      onDelete: 'CASCADE'
    });
    UserNotification.belongsTo(models.User, {
      foreignKey: 'authorId',
      sourceKey: 'authorId',
      as: 'author',
      onDelete: 'CASCADE'
    });
    UserNotification.belongsTo(models.Articles, {
      foreignKey: 'articleSlug',
      sourceKey: 'articleSlug',
      targetKey: 'slug',
      as: 'article',
      onDelete: 'CASCADE'
    });
    UserNotification.belongsTo(models.ArticleComment, {
      foreignKey: 'commentId',
      sourceKey: 'commentId',
      as: 'comment',
      onDelete: 'CASCADE'
    });
  };
  return UserNotification;
};
