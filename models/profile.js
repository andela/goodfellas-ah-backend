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
    Profiles.hasMany(models.Articles, { as: 'article', foreignKey: 'authorId' });
    Profiles.belongsTo(models.User, {
      foreignKey: 'userId',
      sourceKey: 'userId',
      as: 'user',
      onDelete: 'CASCADE',
    });
  };
  return Profiles;
};
