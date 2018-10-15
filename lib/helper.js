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
const checkExistence = async (model, searchParam) => {
  const existing = await model.findOne({ where: searchParam });
  return existing;
};
const throwErrorOnBadRequest = async (followerId, followedUserId) => {
  if (Number(followedUserId) === Number(followerId)) throw new Error('Error: You cannot follow yourself');
  const existingFollow = await checkExistence(FollowersTable, { followerId, followedUserId });
  if (existingFollow) throw new Error('Error: You\'re already following this user');
};
const throwErrorOnNonExistingUser = async (userId) => {
  const existingUser = await checkExistence(User, {
    id: userId
  });
  if (!existingUser) throw new Error('Error: User doen\'t exist');
  return existingUser;
};

export default {
  throwErrorOnBadRequest,
  throwErrorOnNonExistingUser,
  checkExistence,
};
