import models from '../models';
import utility from '../lib/utility';
import helper from '../lib/helper';

const { Articles, Reactions, Bookmark } = models;

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
  } = req.body;
  let image = null;
  if (req.files && req.files.image) {
    image = await utility.imageUpload(req.files);
  }
  return Articles
    .create({
      title,
      description,
      body,
      image,
      authorId: req.userId
    })
    .then(article => res.status(201).send({ message: 'You have created an article successfully', article }))
    .catch(error => res.status(500).send({ error: error.message }));
};

/**
 * modifies an article
 * @param {object} req The request body of the request.
 * @param {object} res The response body.
 * @returns {object} res.
 */

const updateArticle = async (req, res) => {
  const { slug } = req.params;

  const existingArticle = await helper.findRecord(Articles, {
    slug
  });
  if (!existingArticle) {
    return res.status(404).send({ error: 'Article not found!' });
  }

  if (existingArticle !== null && existingArticle.authorId !== req.userId) {
    return res.status(403).send({ message: 'You cannot modify an article added by another User' });
  }
  let image = null;
  if (req.files && req.files.image) {
    image = await utility.imageUpload(req.files);
  }
  existingArticle.updateAttributes({
    title: req.body.title || existingArticle.title,
    description: req.body.description || existingArticle.description,
    body: req.body.body || existingArticle.body,
    image,
  })
    .then(updatedArticle => res.status(200).send({ message: 'Article successfully modified', updatedArticle }))
    .catch(error => res.status(500).send({ error: error.message }));
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
    slug
  });

  if (!existingArticle) {
    return res.status(404).send({ error: 'Article not found!' });
  }
  if (existingArticle.authorId !== req.userId) {
    return res.status(403).send({ error: 'You cannot delete an article added by another user' });
  }
  return existingArticle.destroy()
    .then(res.status(200).send({ message: 'article successfully deleted' }))
    .catch(error => res.status(500).send({ error: error.message }));
};


/**
 * gets all articles
 * @param {object} req The request body of the request.
 * @param {object} res The response body.
 * @returns {object} res.
 */

const getAllArticles = (req, res) => Articles
  .findAll({
    include: {
      model: Bookmark,
      as: 'bookmarked',
      where: { userId: req.userId },
      attributes: ['createdAt', 'updatedAt'],
      required: false,
    }
  })
  .then((article) => {
    if (article.length < 1) {
      return res.status(404).send({ message: 'Article Not found!' });
    }
    return res.status(200).send({
      message: 'Articles gotten successfully!',
      article,
    });
  })
  .catch(error => res.status(500).send({ error: error.message }));

/**
 * fetches an article
 * @param {object} req The request body of the request.
 * @param {object} res The response body.
 * @returns {object} res.
 */

const getAnArticle = async (req, res) => {
  const { slug } = req.params;
  try {
    const existingArticle = await helper.findArticle(slug, req.userId);

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
    const existingArticle = await helper.findRecord(Articles, { slug });
    if (!existingArticle) { return res.status(404).send({ message: 'Article Not found!' }); }

    const articleId = existingArticle.id;
    const existingReaction = await Reactions.findOne({ where: { userId, articleId } });

    if (existingReaction && (existingReaction.reaction === reaction)) {
      existingReaction.destroy();
      return res.status(200).send({ message: 'Successfully removed reaction' });
    } else if (existingReaction) {
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
 * @param {object} res The response body.
 * @returns {object} res.
 */

const bookmarkArticle = async (req, res) => {
  const { slug } = req.params;
  const { userId } = req;
  try {
    const existingArticle = await helper.findArticle(slug);
    if (!existingArticle) return res.status(404).send({ error: 'Article Not found!' });
    const existingBookmark = await Bookmark.count({ where: { userId, articleSlug: slug } });
    if (existingBookmark) return res.status(400).send({ error: 'Article has been previously bookmarked' });
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
    if (!existingArticle) return res.status(404).send({ error: 'Article Not found!' });
    const deletedBookmark = await Bookmark.destroy({ where: { userId, articleSlug: slug } });
    if (deletedBookmark === 0) return res.status(400).send({ error: 'This article is not currently bookmarked' });

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
        }
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

export default {
  createArticle,
  updateArticle,
  deleteArticle,
  getAllArticles,
  getAnArticle,
  reactToArticle,
  bookmarkArticle,
  deleteBookmark,
  getBookmarks,
};
