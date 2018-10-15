import { User, FollowersTable } from '../models';

module.exports = {
  resetDB() {
    FollowersTable.destroy({ truncate: true, cascade: true });
    User.destroy({ truncate: true, cascade: true });
  },
};
