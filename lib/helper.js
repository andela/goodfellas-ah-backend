const db = require('../models');

const {
  User,
  FollowersTable,
  Reactions,
  Bookmark,
  Articles,
  ReadingStats
} = db;

/**
 * checks for the existence of any data in the database
 * @param {object} model The database model.
 * @param {object} searchParam The search parameter needed to query the database.
 * @returns {boolean} existing
 */
const findRecord = async (model, searchParam) => {
  const existing = await model.findOne({ where: searchParam });
  return existing;
};
const findArticle = async (slug, userId) => {
  const existingArticle = await Articles.findOne({
    where: { slug },
    include: {
      model: Bookmark,
      as: 'bookmarked',
      where: { userId, articleSlug: slug },
      required: false,
    },
  });
  return existingArticle;
};
const throwErrorOnBadRequest = async (followerId, followedUserId) => {
  if (Number(followedUserId) === Number(followerId)) throw new Error('Error: You cannot follow yourself');
  const existingFollow = await findRecord(FollowersTable, { followerId, followedUserId });
  if (existingFollow) throw new Error('Error: You\'re already following this user');
};
const throwErrorOnNonExistingUser = async (userId) => {
  const existingUser = await findRecord(User, {
    id: userId
  });
  if (!existingUser) throw new Error('Error: User doen\'t exist');
  return existingUser;
};
const countReactions = async (existingArticle) => {
  const articleId = existingArticle.id;
  const likeCountQuery = Reactions.count({ where: { articleId, reaction: 1 } });
  const dislikeCountQuery = Reactions.count({ where: { articleId, reaction: -1 } });
  const [likes, dislikes] = await Promise.all([likeCountQuery, dislikeCountQuery]);

  const reactions = { likes, dislikes };
  const article = existingArticle.toJSON();
  article.reactions = reactions;
  return article;
};
const bookmarkArticle = async (userId, articleSlug) => {
  const bookmarked = await Bookmark.create({ userId, articleSlug });
  const { dataValues: bookmarkedDataValues } = bookmarked;
  return bookmarkedDataValues;
};

export default {
  throwErrorOnBadRequest,
  throwErrorOnNonExistingUser,
  bookmarkArticle,
  findRecord,
  countReactions,
  findArticle,
};
