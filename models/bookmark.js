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
      as: 'article',
      targetKey: 'slug',
      onDelete: 'CASCADE'
    });
  };
  return Bookmark;
};
