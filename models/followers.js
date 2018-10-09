module.exports = (sequelize, DataTypes) => {
  const FollowersTable = sequelize.define('FollowersTable', {
    followerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    followedId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {});
  FollowersTable.associate = (models) => {
    FollowersTable.belongsTo(models.User, {
      foreignKey: 'followerId',
      sourceKey: 'followerId',
      onDelete: 'CASCADE',
    });
    FollowersTable.belongsTo(models.User, {
      foreignKey: 'followedId',
      sourceKey: 'followedId',
      onDelete: 'CASCADE',
    });
  };
  return FollowersTable;
};
