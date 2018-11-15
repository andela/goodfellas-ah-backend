const db = require('../models');

const {
  User,
  FollowersTable,
  Reactions,
  Bookmark,
  Articles,
  FavoriteArticle,
  UserNotification,
  ArticleComment,
  Rating,
  Profiles,
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

const getArticles = async (model, searchParams) => {
  const { page, limit, userId } = searchParams;
  const offset = limit * (page - 1);

  const articleList = await model.findAndCountAll({
    where: { archived: false, published: true },
    include: [
      {
        model: Bookmark,
        as: 'bookmarked',
        where: { userId },
        attributes: ['createdAt', 'updatedAt'],
        required: false
      },
      {
        model: User,
        as: 'user',
        required: false,
        attributes: ['firstname', 'lastname'],
        include: {
          model: Profiles,
          as: 'profile',
          required: false,
          attributes: ['image']
        }
      },
      {
        model: Reactions,
        as: 'reactions',
        required: false,
        attributes: ['reaction']
      },
      {
        model: FavoriteArticle,
        as: 'favorite',
        where: { user_id: userId },
        attributes: ['createdAt', 'updatedAt'],
        required: false
      },
      {
        model: Rating,
        as: 'star_ratings'
      }
    ],
    limit,
    offset,
    order: [['id', 'DESC']]
  });
  const pages = Math.ceil(articleList.count / limit);
  const articles = articleList.rows;
  return { articles, pages };
};

const findArticle = async (slug, userId) => {
  const existingArticle = await Articles.findOne({
    where: { slug, archived: false, published: true },
    include: [
      {
        model: Bookmark,
        as: 'bookmarked',
        where: { userId, articleSlug: slug },
        required: false,
      },
      {
        model: FavoriteArticle,
        as: 'favorite',
        where: { user_id: userId },
        attributes: ['createdAt', 'updatedAt'],
        required: false
      },
      {
        model: Rating,
        as: 'star_ratings'
      }
    ],
  });
  return existingArticle;
};
const getArticleFavoriters = async (slug) => {
  const favoriters = await FavoriteArticle.findAll({
    where: { article_slug: slug },
    raw: true,
    attributes: ['user_id'],
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['firstname', 'lastname', 'id', 'email', 'role', 'notificationSettings'],
      }
    ]
  });
  return favoriters;
};
const throwErrorOnBadRequest = async (followerId, followedUserId) => {
  if (Number(followedUserId) === Number(followerId)) throw new Error('Error: You cannot follow yourself');
  const existingFollow = await findRecord(FollowersTable, { followerId, followedUserId });
  if (existingFollow) throw new Error("Error: You're already following this user");
};
const throwErrorOnNonExistingUser = async (userId) => {
  const existingUser = await findRecord(User, {
    id: userId
  });
  if (!existingUser) throw new Error("Error: User doen't exist");
  return existingUser;
};
const getFollowers = async (userId) => {
  const followers = await FollowersTable.findAndCountAll({
    where: { followedUserId: userId },
    attributes: { exclude: ['followedUserId'] },
    include: {
      model: User,
      as: 'follower',
      attributes: ['firstname', 'lastname', 'email', 'role'],
      include: {
        model: Profiles,
        as: 'profile'
      }
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
const getNotifications = async (where) => {
  const notifications = await UserNotification.findAndCountAll({
    where,
    attributes: {
      exclude: 'userId'
    },
    include: [{
      model: User,
      as: 'author',
      attributes: ['firstname', 'lastname'],
      required: false,
    },
    {
      model: Articles,
      as: 'article',
      required: false,
      include: {
        model: FavoriteArticle,
        as: 'favorite',
        where: { user_id: null },
        attributes: ['createdAt', 'updatedAt'],
        required: false
      },
    },
    {
      model: ArticleComment,
      as: 'comment',
      required: false,
    }]
  });
  return notifications;
};
const getNotification = async (where) => {
  const notification = await UserNotification.find({
    where,
    include: ['comment',
      {
        model: User,
        as: 'author',
        attributes: ['firstname', 'lastname', 'id', 'email', 'role']
      },
      {
        model: Articles,
        as: 'article',
        include: {
          model: FavoriteArticle,
          as: 'favorite',
          where: { user_id: null },
          attributes: ['createdAt', 'updatedAt'],
          required: false
        }
      }]
  });
  return notification;
};
const countReactions = async (existingArticle) => {
  const articleId = existingArticle.id;
  const { slug } = existingArticle;
  const likeCountQuery = Reactions.count({ where: { articleId, reaction: 1 } });
  const dislikeCountQuery = Reactions.count({ where: { articleId, reaction: -1 } });
  const favoriteCountQuery = await FavoriteArticle.count({ where: { article_slug: slug } });
  const [likes, dislikes] = await Promise.all([likeCountQuery, dislikeCountQuery]);

  const reactions = { likes, dislikes };
  const article = existingArticle.toJSON();
  article.favoritesCount = favoriteCountQuery;
  article.reactions = reactions;
  return article;
};
const bookmarkArticle = async (userId, articleSlug) => {
  const bookmarked = await Bookmark.create({ userId, articleSlug });
  const { dataValues: bookmarkedDataValues } = bookmarked;
  return bookmarkedDataValues;
};

const updateRecord = async (record, values) => {
  const updatedRecord = await record.update(values);
  return updatedRecord;
};

const postRecord = async (Record, values) => {
  const postedRecord = await Record.create(values);
  return postedRecord;
};


export default {
  throwErrorOnBadRequest,
  throwErrorOnNonExistingUser,
  bookmarkArticle,
  getFollowers,
  getRawFollowers,
  findRecord,
  countReactions,
  getArticles,
  findArticle,
  getNotifications,
  getNotification,
  getArticleFavoriters,
  updateRecord,
  postRecord
};
