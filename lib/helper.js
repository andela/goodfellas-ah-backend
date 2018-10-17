const db = require('../models');

const {
  User,
  FollowersTable,
  Profiles,
  Articles,
  Reactions,
  Bookmark,
} = db;

const findUser = async (email) => {
  const existingUser = await User.findOne({ where: { email } });
  return existingUser;
};
const throwErrorOnBadRequest = async (followerId, followedUserId) => {
  if (Number(followedUserId) === Number(followerId)) throw new Error('Error: You cannot follow yourself');
  const existingFollow = await FollowersTable.findOne({ where: { followerId, followedUserId } });
  if (existingFollow) throw new Error('Error: You\'re already following this user');
};
const throwErrorOnNonExistingUser = async (userId) => {
  const existingUser = await User.findById(userId);
  if (!existingUser) throw new Error('Error: User doen\'t exist');
  return existingUser;
};
const getFollowers = async (userId) => {
  const followers = await FollowersTable.findAndCountAll({
    where: { followedUserId: userId },
    attributes: { exclude: ['followedUserId'] },
    include: {
      model: User,
      as: 'follower',
      attributes: ['firstname', 'lastname', 'email', 'role']
    }
  });
  return {
    followers: followers.rows,
    count: followers.count
  };
};
const getRawFollowers = async (userId) => {
  const followers = await FollowersTable.findAll({
    where: { followedUserId: userId },
    raw: true,
    attributes: { exclude: ['followedUserId'] },
    include: {
      model: User,
      as: 'follower',
      attributes: ['firstname', 'lastname', 'id', 'email', 'role', 'notificationSettings']
    }
  });
  return followers;
};
const findProfile = async (userId) => {
  const existingUser = await Profiles.findOne({ where: { userId } });
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
const findArticle = async (slug, userId) => {
  const existingArticle = await Articles.findOne({
    where: { slug },
    include: {
      model: Bookmark,
      as: 'bookmarked',
      where: { userId },
      required: false,
      attributes: ['createdAt', 'updatedAt'],
    }
  });
  return existingArticle;
};
const bookmarkArticle = async (userId, articleSlug) => {
  const bookmarked = await Bookmark.create({ userId, articleSlug });
  const { dataValues: bookmarkedDataValues } = bookmarked;
  delete bookmarkedDataValues.articleSlug;
  return bookmarkedDataValues;
};

export default {
  findUser,
  throwErrorOnBadRequest,
  throwErrorOnNonExistingUser,
  findProfile,
  findArticle,
  countReactions,
  bookmarkArticle,
  getFollowers,
  getRawFollowers,
};
