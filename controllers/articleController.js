import { Articles, Rating } from '../models';
import helper from '../lib/helper';

/**
 * Creates an article
 * @param {object} req The request body of the request.
 * @param {object} res The response body.
 * @returns {object} res.
 */

const createArticle = (req, res) => {
  const {
    title,
    description,
    body,
    image
  } = req.body;
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

  const existingArticle = await helper.findArticle(slug);
  if (!existingArticle) {
    return res.status(404).send({ error: 'Article not found!' });
  }

  if (existingArticle !== null && existingArticle.authorId !== req.userId) {
    return res.status(403).send({ message: 'You cannot modify an article added by another User' });
  }

  existingArticle.updateAttributes({
    title: req.body.title || existingArticle.title,
    description: req.body.description || existingArticle.description,
    body: req.body.body || existingArticle.body,
    image: req.body.image || existingArticle.image,
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
  const existingArticle = await helper.findArticle(slug);

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
  .findAll({ include: [{ model: Rating, as: 'star_ratings' }] })
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
    const existingArticle = await helper.findArticle(slug);

    if (!existingArticle) {
      return res.status(404).send({ error: 'Article Not found!' });
    }
    res.status(200).send({ message: 'Article gotten successfully!', existingArticle });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// method for averaging all ratings of an article and
// adding to the article object
const addRatingsToArticle = (res, req, rated) => {
  if (rated) {
    const ratingSum = 0;
    return Rating.findAll({ where: { articleId: req.article.id } })
      .then((ratings) => {
        ratings.forEach(rate => ratingSum + rate.starRating);
        const averageRating = ratingSum / ratings.length;

        return req.article.update({ averageRating })
          .then(ratedArticle => res.status(201).send({
            message: `You've rated this article ${req.userRating} star`,
            ratedArticle,
            ratings
          }));
      });
  }
  return res.status(500).send({
    error: 'Internal server error'
  });
};

// method for posting the ratings of an article
const postRating = async (req, res) => {
  if (req.rating) {
    const updatedRating = await helper.updateRating(req.rating, req.userRating);
    return addRatingsToArticle(res, req, updatedRating);
  }
  const postedRating = await helper.addRating(req.userRating, req.userId, req.article.id);
  return addRatingsToArticle(res, req, postedRating);
};

export default {
  createArticle,
  updateArticle,
  deleteArticle,
  getAllArticles,
  getAnArticle,
  postRating
};
