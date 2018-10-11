module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password_reset_token: {
      type: DataTypes.STRING,
    },
    password_reset_time: {
      type: DataTypes.DATE,
    },
    role: {
      type: DataTypes.ENUM,
      defaultValue: 'User',
      values: ['SuperAdmin', 'Admin', 'User']
    }
  }, {});
  User.associate = (models) => {
    User.hasOne(models.Profiles, { as: 'profile', foreignKey: 'userId' });
    User.hasMany(models.FollowersTable, {
      foreignKey: 'followedUserId'
    });
    User.hasMany(models.FollowersTable, {
      foreignKey: 'followerId'
    });
  };
  return User;
};
