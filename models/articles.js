import SequelizeSlugify from 'sequelize-slugify';
import eventEmitter from '../lib/eventEmitter';

module.exports = (sequelize, DataTypes) => {
  const Articles = sequelize.define('Articles', {
    slug: {
      type: DataTypes.STRING,
      unique: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true
    },
    tagList: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true
    },
    favorited: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    favoritesCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    read_time: {
      type: DataTypes.STRING,
      allowNull: true
    },
    averageRating: {
      type: DataTypes.STRING,
    },
    authorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    }
  },
  {
    hooks: {
      afterCreate(article) {
        const { authorId, slug, title } = article;
        eventEmitter.emit('article created', authorId, slug, title);
      }
    },
    getterMethods: {
      favorited() {
        return this.getDataValue('favorite') ? this.getDataValue('favorite').length > 0 : null;
      },
      favoritesCount() {
        return this.getDataValue('favorite') ? this.getDataValue('favorite').length : null;
      }
    },
  });
  Articles.associate = (models) => {
    Articles.belongsTo(models.User, { as: 'user', foreignKey: 'authorId' });
    Articles.hasMany(models.Bookmark, {
      foreignKey: 'articleSlug',
      as: 'bookmarked',
      targetKey: 'articleSlug',
      sourceKey: 'slug',
    });
    Articles.hasMany(models.Rating, { foreignKey: 'articleId', as: 'star_ratings' });
    Articles.hasMany(models.Reactions, { as: 'reactions', foreignKey: 'articleId' });
    Articles.hasMany(models.ArticleComment, {
      as: 'comments',
      foreignKey: 'article_slug',
      targetKey: 'article_slug',
      sourceKey: 'slug',
    });
    Articles.hasMany(models.ReadingStats, { as: 'reading_stats', foreignKey: 'articleId' });

    Articles.hasMany(models.FavoriteArticle, {
      foreignKey: 'article_slug',
      as: 'favorite',
      targetKey: 'article_slug',
      sourceKey: 'slug',
    });
  };
  SequelizeSlugify.slugifyModel(Articles, {
    source: ['title'],
    slugOptions: { lower: true },
    overwrite: false,
    column: 'slug'
  });
  return Articles;
};
