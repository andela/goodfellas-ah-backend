module.exports = (sequelize, DataTypes) => {
  const Rating = sequelize.define('Rating', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    starRating: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  }, {});
  Rating.associate = (models) => {
    Rating.belongsTo(models.Articles, {
      foreignKey: 'articleId',
      onDelete: 'CASCADE',
    });
  };
  return Rating;
};