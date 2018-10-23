import models, { Sequelize } from '../models';

const { Op } = Sequelize;
const {
  Articles, User,
} = models;

/**
 * search Articles controller
 * @param {object} req search request
 * @param {object} res search response
 * @returns {object} search result
 */
const searchArticles = async (req, res) => {
  try {
    // Get the entire query string
    const { article, author, tag } = req.query;
    // First check if all are false and return an error
    if (author === 'false' && article === 'false' && tag === 'false') {
      res.status(404).send({ error: 'Please input something' });
    }

    // Now conduct searches
    if (author !== 'false' && article !== 'false' && tag !== 'false') {
      // Search by all, if available
      User.findAll({
        where: {
          [Op.or]: {
            firstname: {
              [Op.iLike]: `%${author}%`
            },
            lastname: {
              [Op.iLike]: `%${author}%`
            }
          }
        }
      })
        .then((result) => {
          Articles.findAll({
            where: {
              [Op.and]: {
                authorId: result[0].dataValues.id,
                title: {
                  [Op.iLike]: `%${article}%`
                },
                tagList: {
                  [Op.contains]: [tag]
                }
              }
            }
          })
            .then((articles) => {
              if (articles.length > 0) {
                res.status(200).send({ success: true, articles });
              } else {
                res.status(404).send({ success: false, message: "We couldn't find any articles." });
              }
            })
            .catch(() => {
              res.status(500).send({ message: 'Internal server error' });
            });
        })
        .catch(() => res.status(404).send({ success: false, message: "We couldn't find any articles." }));
    } else if (author !== 'false' && article !== 'false') {
      // Search by author and article
      User.findAll({
        where: {
          [Op.or]: {
            firstname: {
              [Op.iLike]: `%${author}%`
            },
            lastname: {
              [Op.iLike]: `%${author}%`
            }
          }
        }
      }).then((result) => {
        Articles.findAll({
          where: {
            [Op.and]: {
              authorId: result[0].dataValues.id,
              title: {
                [Op.iLike]: `%${article}%`
              }
            }
          }
        }).then((articles) => {
          if (articles.length > 0) {
            res.status(200).send({ success: true, articles });
          } else {
            res.status(404).send({ success: false, message: "We couldn't find any articles." });
          }
        });
      });
    } else if (author !== 'false' && tag !== 'false') {
      // Search by author and tag
      User.findAll({
        where: {
          [Op.or]: {
            firstname: {
              [Op.iLike]: `%${author}%`
            },
            lastname: {
              [Op.iLike]: `%${author}%`
            }
          }
        }
      })
        .then((result) => {
          Articles.findAll({
            where: {
              [Op.and]: {
                authorId: result[0].dataValues.id,
                tagList: {
                  [Op.contains]: [tag]
                }
              }
            }
          }).then((articles) => {
            if (articles.length > 0) {
              res.status(200).send({ success: true, articles });
            } else {
              res.status(404).send({ success: false, message: "We couldn't find any articles." });
            }
          });
        })
        .catch(() => res.status(404).send({ success: false, message: "We couldn't find any articles." }));
    } else if (tag !== 'false' && article !== 'false') {
      // Search by tag and article
      Articles.findAll({
        where: {
          [Op.and]: {
            title: {
              [Op.iLike]: `%${article}%`
            },
            tagList: {
              [Op.contains]: [tag]
            }
          }
        }
      })
        .then((articles) => {
          if (articles.length > 0) {
            res.status(200).send({ success: true, articles });
          } else {
            res.status(404).send({ success: false, message: "We couldn't find any articles." });
          }
        })
        .catch(error => res.status(500).send({ error }));
    } else if (author !== 'false') {
      // Search by author
      User.findAll({
        where: {
          [Op.or]: {
            firstname: {
              [Op.iLike]: `%${author}%`
            },
            lastname: {
              [Op.iLike]: `%${author}%`
            }
          }
        }
      })
        .then((result) => {
          Articles.findAll({
            where: {
              authorId: result[0].dataValues.id
            }
          }).then((articles) => {
            if (articles.length > 0) {
              res.status(200).send({ success: true, articles });
            }
          });
        })
        .catch(() => {
          res.status(404).send({ success: false, message: "We couldn't find any articles." });
        });
    } else if (article !== 'false') {
      // Search by article
      Articles.findAll({
        where: {
          title: {
            [Op.iLike]: `%${article}%`
          }
        }
      }).then((articles) => {
        if (articles.length > 0) {
          res.status(200).send({ success: true, articles });
        } else {
          res.status(404).send({ success: false, message: "We couldn't find any articles." });
        }
      });
    } else if (tag !== 'false') {
      // Search by tag
      Articles.findAll({
        where: {
          tagList: {
            [Op.contains]: [tag]
          }
        }
      })
        .then((articles) => {
          if (articles.length > 0) {
            res.status(200).send({ success: true, articles });
          } else {
            res.status(404).send({ success: false, message: "We couldn't find any articles." });
          }
        })
        .catch(() => {
          res.status(500).send({ message: 'internal server error' });
        });
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

export default searchArticles;
