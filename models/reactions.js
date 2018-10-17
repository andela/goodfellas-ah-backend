
module.exports = (sequelize, DataTypes) => {
  const Reactions = sequelize.define('Reactions', {
    reaction: DataTypes.INTEGER
  }, {});
  Reactions.associate = (models) => {
    Reactions.belongsTo(models.User, { as: 'user', foreignKey: 'userId' });
    Reactions.belongsTo(models.Articles, { as: 'article', foreignKey: 'articleId' });
  };
  return Reactions;
};
