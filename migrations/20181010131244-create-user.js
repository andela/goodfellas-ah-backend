
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Users', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    firstname: {
      type: Sequelize.STRING,
      allowNull: false
    },
    lastname: {
      type: Sequelize.STRING,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    account_type: {
      type: Sequelize.ENUM,
      defaultValue: 'Local',
      values: ['Local', 'google', 'facebook', 'twitter']
    },
    password_reset_token: {
      type: Sequelize.STRING,
    },
    password_reset_time: {
      type: Sequelize.DATE,
    },
    role: {
      type: Sequelize.ENUM,
      defaultValue: 'User',
      values: ['SuperAdmin', 'Admin', 'User']
    },
    notificationSettings: {
      type: Sequelize.ARRAY(Sequelize.STRING),
      defaultValue: ['email', 'inApp']
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  }),
  down: queryInterface => queryInterface.dropTable('Users')
};
