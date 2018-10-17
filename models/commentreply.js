

module.exports = (sequelize, DataTypes) => {
  const CommentReply = sequelize.define('CommentReply', {
    body: DataTypes.STRING,
    comment_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER
  }, {});
  CommentReply.associate = (models) => {
    CommentReply.belongsTo(models.User, {
      foreignKey: 'user_id',
      sourceKey: 'user_id',
      as: 'user',
      onDelete: 'CASCADE',
    });
  };
  return CommentReply;
};
