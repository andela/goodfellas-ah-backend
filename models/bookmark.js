module.exports = (sequelize, DataTypes) => {
  const Bookmark = sequelize.define('Bookmark', {
    articleSlug: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {});
  Bookmark.associate = (models) => {
    Bookmark.belongsTo(models.User, {
      foreignKey: 'userId',
      sourceKey: 'userId',
      as: 'user',
      onDelete: 'CASCADE'
    });
    Bookmark.belongsTo(models.Articles, {
      foreignKey: 'articleSlug',
      sourceKey: 'articleSlug',
      targetKey: 'slug',
      as: 'article',
      onDelete: 'CASCADE'
    });
  };
  return Bookmark;
};
