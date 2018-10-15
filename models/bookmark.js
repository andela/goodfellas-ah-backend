module.exports = (sequelize, DataTypes) => {
  const Bookmark = sequelize.define('Bookmark', {
    articleSlug: {
      type: DataTypes.STRING,
      allowNull: false
    },
    authorId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {});
  Bookmark.associate = (models) => {
    Bookmark.belongsTo(models.User, {
      foreignKey: 'authorId',
      sourceKey: 'authorId',
      as: 'author',
      onDelete: 'CASCADE',
    });
    Bookmark.belongsTo(models.Articles, {
      foreignKey: 'articleSlug',
      sourceKey: 'slug',
      as: 'article',
      onDelete: 'CASCADE',
    });
  };
  return Bookmark;
};
