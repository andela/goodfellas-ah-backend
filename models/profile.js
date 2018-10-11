module.exports = (sequelize, DataTypes) => {
  const Profiles = sequelize.define(
    'Profiles',
    {
      username: {
        type: DataTypes.STRING,
        allowNull: true
      },
      bio: {
        type: DataTypes.STRING,
        allowNull: true
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true
      },
      following: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      }
    },
    {}
  );
  Profiles.associate = (models) => {
    Profiles.belongsTo(models.User, { as: 'user' });
  };
  return Profiles;
};
