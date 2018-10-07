
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
    account_type: {
      type: DataTypes.ENUM,
      defaultValue: 'Local',
      values: ['Local', 'google-plus', 'facebook', 'twitter']
    },
    role: {
      type: DataTypes.ENUM,
      defaultValue: 'User',
      values: ['SuperAdmin', 'Admin', 'User']
    }
  }, {});
  User.associate = () => {
    // associations can be defined here
  };
  return User;
};
