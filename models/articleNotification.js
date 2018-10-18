import eventEmitter from '../lib/eventEmitter';

module.exports = (sequelize, DataTypes) => {
  const ArticleNotification = sequelize.define('ArticleNotification', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    authorId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    articleSlug: {
      type: DataTypes.STRING,
      allowNull: false
    },
    articleTitle: {
      type: DataTypes.STRING,
      allowNull: false
    },
    seen: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    hooks: {
      afterCreate(notification) {
        eventEmitter.emit('notification created', notification);
      }
    }
  });
  ArticleNotification.associate = (models) => {
    ArticleNotification.belongsTo(models.User, {
      foreignKey: 'userId',
      sourceKey: 'userId',
      as: 'user',
      onDelete: 'CASCADE'
    });
    ArticleNotification.belongsTo(models.User, {
      foreignKey: 'authorId',
      sourceKey: 'authorId',
      as: 'author',
      onDelete: 'CASCADE'
    });
    ArticleNotification.belongsTo(models.Articles, {
      foreignKey: 'articleSlug',
      sourceKey: 'articleSlug',
      targetKey: 'slug',
      as: 'article',
      onDelete: 'CASCADE'
    });
  };
  return ArticleNotification;
};
