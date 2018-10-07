module.exports = (sequelize, DataTypes) => {
  const UserFollow = sequelize.define('UserFollow', {
    followerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    followedId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {});
  UserFollow.associate = (models) => {
    UserFollow.belongsTo(models.User, {
      foreignKey: 'followerId',
      sourceKey: 'followerId',
      onDelete: 'CASCADE',
    });
    UserFollow.belongsTo(models.User, {
      foreignKey: 'followedId',
      sourceKey: 'followedId',
      onDelete: 'CASCADE',
    });
  };
  return UserFollow;
};
