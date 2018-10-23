const db = require('../models');

const {
  User, Reactions, FollowersTable, ArticleComment, CommentReply, Profiles, Articles, CommentReaction
} = db;

module.exports = {
  resetDB() {
    Reactions.destroy({ truncate: true, cascade: true });
    FollowersTable.destroy({ truncate: true, cascade: true });
    User.destroy({ truncate: true, cascade: true });
    ArticleComment.destroy({ truncate: true, cascade: true });
    CommentReply.destroy({ truncate: true, cascade: true });
    Profiles.destroy({ truncate: true, cascade: true });
    Articles.destroy({ truncate: true, cascade: true });
    CommentReaction.destroy({ truncate: true, cascade: true });
  },
};
