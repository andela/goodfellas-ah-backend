
module.exports = (sequelize, DataTypes) => {
  const FavoriteArticle = sequelize.define('FavoriteArticle', {
    user_id: DataTypes.INTEGER,
    article_slug: DataTypes.STRING
  }, {});
  FavoriteArticle.associate = (models) => {
    FavoriteArticle.belongsTo(models.User, {
      foreignKey: 'user_id',
      sourceKey: 'user_d',
      as: 'user',
      onDelete: 'CASCADE'
    });
    FavoriteArticle.belongsTo(models.Articles, {
      foreignKey: 'article_slug',
      sourceKey: 'article_slug',
      targetKey: 'slug',
      as: 'article',
      onDelete: 'CASCADE'
    });
  };
  return FavoriteArticle;
};
