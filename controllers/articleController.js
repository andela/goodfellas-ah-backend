/* eslint no-plusplus:0 */
import utility from '../lib/utility';
import helper from '../lib/helper';
import {
  Articles,
  Reactions,
  Bookmark,
  FavoriteArticle,
  Rating,
  ReportArticle,
  ArticleComment,
  User,
  Profiles,
} from '../models';

/**
 * Creates an article
 * @param {object} req The request body of the request.
 * @param {object} res The response body.
 * @returns {object} res.
 */

const createArticle = async (req, res) => {
  const {
    title,
    description,
    body,
    published,
  } = req.body;
  try {
    // Calculate the article's read time

    let image = null;
    if (req.files && req.files.image) {
      image = await utility.imageUpload(req.files);
    }

    const readTime = utility.readTime(body, image);

    const article = await Articles.create({
      title,
      description,
      body,
      image,
      read_time: readTime,
      authorId: req.userId,
      published,
    });
    const existingArticle = await helper.findArticle(article.slug, req.userId);
    res.status(201).send({
      message: 'You have created an article successfully',
      article: existingArticle
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

/**
 * modifies an article
 * @param {object} req The request body of the request.
 * @param {object} res The response body.
 * @returns {object} res.
 */

const updateArticle = async (req, res) => {
  const { slug } = req.params;
  try {
    const existingArticle = await helper.findRecord(Articles, {
      slug,
      archived: false,
      published: true,
    });
    if (!existingArticle) {
      return res.status(404).send({ error: 'Article not found!' });
    }

    if (existingArticle !== null && existingArticle.authorId !== req.userId) {
      return res.status(403).send({
        message: 'You cannot modify an article added by another User'
      });
    }

    const readTime = utility.readTime(req.body.body, req.body.image);

    let image = null;
    if (req.files && req.files.image) {
      image = await utility.imageUpload(req.files);
    }
    await existingArticle.updateAttributes({
      title: req.body.title || existingArticle.title,
      description: req.body.description || existingArticle.description,
      body: req.body.body || existingArticle.body,
      image,
      read_time: readTime
    });
    const updatedArticle = await helper.findArticle(existingArticle.slug, req.userId);
    return res.status(200).send({ message: 'Article successfully modified', updatedArticle });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

/**
 * deletes an article
 * @param {object} req The request body of the request.
 * @param {object} res The response body.
 * @returns {object} res.
 */

const deleteArticle = async (req, res) => {
  const { slug } = req.params;
  const existingArticle = await helper.findRecord(Articles, {
    slug,
    archived: false,
    published: true,
  });

  if (!existingArticle) {
    return res.status(404).send({ error: 'Article not found!' });
  }
  if (existingArticle.authorId !== req.userId) {
    return res.status(403).send({ error: 'You cannot delete an article added by another user' });
  }
  return existingArticle
    .updateAttributes({
      archived: true,
    })
    .then(res.status(200).send({ message: 'article successfully deleted' }))
    .catch(error => res.status(500).send({ error: error.message }));
};

/**
 * gets all articles
 * @param {object} req The request body of the request.
 * @param {object} res The response body.
 * @returns {object} res.
 */

const getArticles = async (req, res) => {
  let { page, limit } = req.params;
  const { userId } = req;

  console.log(page, limit);
  if (page === undefined) {
    page = 1;
  }
  if (limit === undefined) {
    limit = 100;
  }

  try {
    const { articles, pages } = await helper.getArticles(Articles, {
      page, limit, userId
    });

    if (articles.length < 1) {
      return res.status(404).send({ message: 'Article Not found!' });
    }

    return res.status(200).send({
      message: 'Articles gotten successfully!',
      articles,
      pages
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const getAuthorArticles = async (req, res) => {
  const { authorId } = req.params;

  try {
    const articles = await Articles.findAll({
      where: { authorId },
      include: [
        {
          model: ArticleComment,
          as: 'comments',
        },
        {
          model: Reactions,
          as: 'reactions',
        },
      ]
    });
    return res.status(200).send({
      message: 'Articles gotten successfully!',
      articles
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

/**
 * fetches an article
 * @param {object} req The request body of the request.
 * @param {object} res The response body.
 * @returns {object} res.
 */

const getAnArticle = async (req, res) => {
  const { slug } = req.params;
  const { userId } = req;
  try {
    const existingArticle = await helper.findArticle(slug, userId);

    if (!existingArticle) {
      return res.status(404).send({ error: 'Article Not found!' });
    }

    const article = await helper.countReactions(existingArticle);
    res.status(200).send({ message: 'Article gotten successfully!', article });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

/**
 * likes or dislikes an article
 * @param {object} req The request body of the request.
 * @param {object} res The response body.
 * @returns {object} res.
 */

const reactToArticle = async (req, res) => {
  const { userId } = req;
  const { slug } = req.params;
  const { reaction } = req.body;

  try {
    const existingArticle = await helper.findRecord(
      Articles, { slug, archived: false, published: true, }
    );
    if (!existingArticle) {
      return res.status(404).send({ message: 'Article Not found!' });
    }

    const articleId = existingArticle.id;
    const existingReaction = await Reactions.findOne({
      where: { userId, articleId }
    });

    if (existingReaction && existingReaction.reaction === reaction) {
      existingReaction.destroy();
      return res.status(200).send({ message: 'Successfully removed reaction' });
    }
    if (existingReaction) {
      existingReaction.updateAttributes({ reaction });
      return res.status(200).send({ message: 'Successfully updated reaction' });
    }

    Reactions.create({
      userId,
      articleId,
      reaction
    });

    return res.status(201).send({ message: 'Successfully added reaction' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

/**
 * bookmarks an article
 * @param {object} req The request body which contain the article's slug as param.
 * updates an article's tags
 * @param {object} req The request body of the request.
 * @param {object} res The response body.
 * @returns {object} res.
 */

const addArticleTags = async (req, res) => {
  const { slug } = req.params;
  const { tags } = req.body;

  try {
    const existingArticle = await helper.findRecord(
      Articles, { slug, archived: false, published: true, }
    );
    if (!existingArticle) {
      return res.status(404).send({ error: 'Article Not found!' });
    }

    if (existingArticle !== null && existingArticle.authorId !== req.userId) {
      return res.status(403).send({
        message: 'You cannot modify an article added by another User'
      });
    }

    existingArticle.updateAttributes({ tagList: tags });
    res.status(200).send({
      message: 'Updated article tags successfully',
      data: { tags: existingArticle.tagList }
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

/**
 * bookmarks an article
 * @param {object} req The request body which contain the article's slug as param.
 * @param {object} res The response body.
 * @returns {object} res.
 */

const bookmarkArticle = async (req, res) => {
  const { slug } = req.params;
  const { userId } = req;
  try {
    const existingArticle = await helper.findArticle(slug);
    if (!existingArticle) {
      return res.status(404).send({ error: 'Article Not found!' });
    }
    const existingBookmark = await Bookmark.count({
      where: { userId, articleSlug: slug }
    });
    if (existingBookmark) {
      return res.status(400).send({ error: 'Article has been previously bookmarked' });
    }
    const bookmarked = await helper.bookmarkArticle(userId, slug);
    bookmarked.title = existingArticle.title;

    res.status(200).send({ message: 'Article bookmarked successfully', data: bookmarked });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

/**
 * bookmarks an article
 * @param {object} req The request body which contain the article's slug as param.
 * @param {object} res The response body.
 * @returns {object} res.
 */

const deleteBookmark = async (req, res) => {
  const { slug } = req.params;
  const { userId } = req;
  try {
    const existingArticle = await helper.findArticle(slug);
    if (!existingArticle) {
      return res.status(404).send({ error: 'Article Not found!' });
    }
    const deletedBookmark = await Bookmark.destroy({
      where: { userId, articleSlug: slug }
    });
    if (deletedBookmark === 0) {
      return res.status(400).send({ error: 'This article is not currently bookmarked' });
    }

    res.status(200).send({ message: 'Bookmark removed successfully' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

/**
 * bookmarks an article
 * @param {object} req The request body which contain the id of the logged in user.
 * @param {object} res The response body.
 * @returns {object} res.
 */

const getBookmarks = async (req, res) => {
  const { userId } = req;
  try {
    const bookmarks = await Bookmark.findAndCountAll({
      where: { userId },
      attributes: { exclude: ['userId'] },
      include: {
        model: Articles,
        as: 'article',
        attributes: {
          include: [['id', 'articleId']],
          exclude: ['id']
        },
        include: [
          {
            model: FavoriteArticle,
            as: 'favorite',
            where: { user_id: req.userId },
            attributes: ['createdAt', 'updatedAt'],
            required: false
          }
        ]
      }
    });
    res.status(200).send({
      data: {
        articles: bookmarks.rows,
        articlesCount: bookmarks.count
      },
      message: 'Retrieved Bookmarks'
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

/**
 * report an article
 * @param {object} req The request body which contain the id of the logged in user.
 * @param {object} res The response body.
 * @returns {object} res.
 */
const reportArticle = async (req, res) => {
  const { violation } = req.body;
  const { slug } = req.params;
  try {
    const article = await helper.findArticle(slug);
    if (!article) return res.status(404).send({ error: 'Article Not found!' });

    const report = await ReportArticle.create({
      articleId: article.id,
      authorId: article.authorId,
      reporterId: req.userId,
      violation
    });

    if (report) {
      res.status(201).send({ message: 'You have reported this article successfully', report });
    }
    res.status(500).send({ error: 'Internal server error' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const addRatingsToArticle = async (article) => {
  const ratings = await Rating.findAll({ where: { articleId: article.id } });
  if (ratings) {
    let ratingSum = 0;
    ratings.forEach((rate) => {
      ratingSum += rate.starRating;
    });
    const averageRating = ratingSum / ratings.length;
    const articleUpdated = await article.update({ averageRating });
    return articleUpdated;
  }
};

const postRating = async (req, res) => {
  try {
    const findArticle = await helper.findArticle(req.params.slug);
    if (!findArticle) {
      res.status(404).send({ message: 'Article can not be found' });
    }
    const userRating = await Rating.findOne({
      where: {
        userId: req.userId,
        articleId: findArticle.id
      }
    });

    let addRating;
    if (userRating) {
      const values = { starRating: req.ratingNumber };
      addRating = await helper.updateRecord(userRating, values);
    } else {
      const values = {
        userId: req.userId,
        articleId: findArticle.id,
        starRating: req.ratingNumber
      };
      addRating = await helper.postRecord(Rating, values);
    }

    const ratingsToArticles = await addRatingsToArticle(findArticle);
    if (addRating && ratingsToArticles) {
      res.status(201).send({
        message: `You've rated this article ${req.ratingNumber} star`
      });
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const favoriteArticle = async (req, res) => {
  const { slug } = req.params;
  const { userId } = req;
  try {
    const existingArticle = await helper.findRecord(
      Articles, { slug, archived: false, published: true, }
    );
    if (!existingArticle) {
      return res.status(404).send({ error: 'Article Not found!' });
    }
    const alreadyFavorited = await helper.findRecord(FavoriteArticle, {
      user_id: userId,
      article_slug: slug
    });
    if (alreadyFavorited) {
      return res.status(400).send({ error: 'Article has already been favourited' });
    }
    const article = await FavoriteArticle.create({
      user_id: userId,
      article_slug: slug
    });
    res.status(200).send({ message: 'Article favorited successfully', article });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const deleteFavorite = async (req, res) => {
  const { slug } = req.params;
  const { userId } = req;
  try {
    const existingArticle = await helper.findRecord(
      Articles, { slug, archived: false, published: true, }
    );
    if (!existingArticle) {
      return res.status(404).send({ error: 'Article Not found!' });
    }
    const deletedFavorite = await FavoriteArticle.destroy({
      where: { user_id: userId, article_slug: slug }
    });
    if (deletedFavorite === 0) {
      return res.status(400).send({ error: 'This article is not currently favorited' });
    }
    res.status(200).send({ message: 'Article succesfully removed from list of favorites' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
const getFavorite = async (req, res) => {
  const { slug } = req.params;
  try {
    const existingArticle = await helper.findRecord(
      Articles, { slug, archived: false, published: true, }
    );
    if (!existingArticle) {
      return res.status(404).send({ error: 'Article Not found!' });
    }
    const favorites = await FavoriteArticle.findAndCountAll({
      where: { article_slug: slug }
    });
    res.status(200).send({ message: 'Successfully retrieved users who favorited this article', favorites });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
const getUserFavorites = async (req, res) => {
  const { userId } = req.params;

  try {
    const articles = await FavoriteArticle.findAll({
      where: { user_id: userId },
      include: [{
        model: Articles,
        as: 'article',
        include: [
          {
            model: ArticleComment,
            as: 'comments',
          },
          {
            model: Reactions,
            as: 'reactions',
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
        ]
      }]
    });
    return res.status(200).send({
      message: 'Articles gotten successfully!',
      articles
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

export default {
  createArticle,
  updateArticle,
  deleteArticle,
  getArticles,
  getAnArticle,
  addArticleTags,
  reactToArticle,
  bookmarkArticle,
  deleteBookmark,
  getBookmarks,
  favoriteArticle,
  deleteFavorite,
  getFavorite,
  reportArticle,
  postRating,
  getAuthorArticles,
  getUserFavorites,
};
