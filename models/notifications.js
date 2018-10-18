import eventEmitter from '../lib/eventEmitter';

module.exports = (sequelize, DataTypes) => {
  const Notifications = sequelize.define('Notifications', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    body: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    seen: {
      type: DataTypes.INTEGER,
      defaultValue: false
    }
  },
  {
    hooks: {
      afterCreate(notification) {
        eventEmitter.emit('notification created', notification);
      }
    }
  });
  Notifications.associate = (models) => {
    Notifications.belongsTo(models.User, {
      foreignKey: 'userId',
      sourceKey: 'userId',
      as: 'user',
      onDelete: 'CASCADE'
    });
  };
  return Notifications;
};
