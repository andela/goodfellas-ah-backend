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
    averageRating: {
      type: DataTypes.INTEGER,
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
  }, {});
  Articles.associate = (models) => {
    Articles.hasMany(models.Rating, {
      foreignKey: 'articleId',
      as: 'star_ratings',
    });
  };
  SequelizeSlugify.slugifyModel(Articles, {
    source: ['title'],
    slugOptions: { lower: true },
    overwrite: true,
    column: 'slug'
  });
  return Articles;
};
