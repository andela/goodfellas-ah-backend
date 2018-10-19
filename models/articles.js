const SequelizeSlugify = require('sequelize-slugify');

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
    authorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
  }, {
    getterMethods: {
      favorited() {
        return this.getDataValue('favorite').length > 0;
      },
      favoritesCount() {
        return this.getDataValue('favorite').length;
      }
    },
  });
  Articles.associate = (models) => {
    Articles.hasMany(models.Bookmark, {
      foreignKey: 'articleSlug',
      as: 'bookmarked',
      targetKey: 'articleSlug',
      sourceKey: 'slug',
    });
    Articles.hasMany(models.Reactions, { as: 'reactions', foreignKey: 'articleId' });
    Articles.hasMany(models.ArticleComment, { as: 'article', foreignKey: 'article_slug' });
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
