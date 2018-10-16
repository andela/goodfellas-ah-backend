const db = require('../models');

const {
  User,
  FollowersTable,
} = db;

/**
 * checks for the existence of any data in the database
 * @param {object} model The database model.
 * @param {object} searchParam The search parameter needed to query the database.
 * @returns {boolean} existing
 */
const findItem = async (model, searchParam) => {
  const existing = await model.findOne({ where: searchParam });
  return existing;
};
const throwErrorOnBadRequest = async (followerId, followedUserId) => {
  if (Number(followedUserId) === Number(followerId)) throw new Error('Error: You cannot follow yourself');
  const existingFollow = await findItem(FollowersTable, { followerId, followedUserId });
  if (existingFollow) throw new Error('Error: You\'re already following this user');
};
const throwErrorOnNonExistingUser = async (userId) => {
  const existingUser = await findItem(User, {
    id: userId
  });
  if (!existingUser) throw new Error('Error: User doen\'t exist');
  return existingUser;
};
const errorMessages = {
  noArticle: {
    error: true,
    message: 'Article does not exist',
  },
  noComment: {
    error: true,
    message: 'Comment does not exist'
  },
  noReply: {
    error: true,
    message: 'Reply does not exist'
  }
};

export default {
  throwErrorOnBadRequest,
  throwErrorOnNonExistingUser,
  findItem,
  errorMessages
};
