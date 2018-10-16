const db = require('../models');

const {
  User,
  FollowersTable,
  Profiles,
  Articles,
  Reactions
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
const findArticle = async (slug) => {
  const existingArticle = await Articles.findOne({ where: { slug } });

  return existingArticle;
};

export default {
  findUser,
  throwErrorOnBadRequest,
  throwErrorOnNonExistingUser,
  findProfile,
  findArticle,
  countReactions
};
