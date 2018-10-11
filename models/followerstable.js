module.exports = (sequelize, DataTypes) => {
  const FollowersTable = sequelize.define('FollowersTable', {
    followerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    followedUserId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {});
  FollowersTable.associate = (models) => {
    FollowersTable.belongsTo(models.User, {
      foreignKey: 'followerId',
      sourceKey: 'followerId',
      as: 'follower',
      onDelete: 'CASCADE',
    });
    FollowersTable.belongsTo(models.User, {
      foreignKey: 'followedUserId',
      sourceKey: 'followedUserId',
      as: 'followedUser',
      onDelete: 'CASCADE',
    });
  };
  return FollowersTable;
};
