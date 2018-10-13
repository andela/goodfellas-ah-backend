const db = require('../models');

const { User, FollowersTable, ArticleComment, CommentReply } = db;

module.exports = {
  resetDB() {
    FollowersTable.destroy({ truncate: true, cascade: true });
    User.destroy({ truncate: true, cascade: true });
    ArticleComment.destroy({ truncate: true, cascade: true });
    CommentReply.destroy({ truncate: true, cascade: true });
  },
};
