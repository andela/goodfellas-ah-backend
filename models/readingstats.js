module.exports = (sequelize, DataTypes) => {
  const ReadingStats = sequelize.define('ReadingStats', {
    articleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Articles',
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    authorId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    readerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  }, {});
  ReadingStats.associate = (models) => {
    ReadingStats.belongsTo(models.Articles, {
      foreignKey: 'articleId',
      onDelete: 'CASCADE',
    });
  };
  return ReadingStats;
};
