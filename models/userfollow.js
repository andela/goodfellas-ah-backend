module.exports = (sequelize, DataTypes) => {
  const UserRelationship = sequelize.define('UserRelationship', {
    followerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    followedId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {});
  UserRelationship.associate = (models) => {
    UserRelationship.belongsTo(models.User, {
      foreignKey: 'followerId',
      sourceKey: 'followerId',
      onDelete: 'CASCADE',
    });
    UserRelationship.belongsTo(models.User, {
      foreignKey: 'followedId',
      sourceKey: 'followedId',
      onDelete: 'CASCADE',
    });
  };
  return UserRelationship;
};
