import models, { Sequelize } from '../models';

const { Op } = Sequelize;
const { Articles, User } = models;

/**
 * search Articles controller
 * @param {object} req search request
 * @param {object} res search response
 * @returns {object} search result
 */
const searchArticles = async (req, res) => {
  try {
    // PRIMARY FLOW
    // Get the entire query string
    const { article, author, tag } = req.query;
    console.log(article, author, tag);

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
                tag: {
                  $contains: tag
                }
              }
            }
          }).then((finalResult) => {
            if (finalResult.length > 0) {
              res
                .status(200)
                .send({ message: 'Eureka, I Found them!', finalResult });
            } else {
              res
                .status(404)
                .send({ message: "We couldn't find any articles." });
            }
          });
        })
        .catch(() => res.status(404).send({ message: "We couldn't find any articles." }));
    } else if (author !== 'false' && article !== 'false') {
      // Search by author and article
      console.log(article);
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
                }
              }
            }
          }).then((finalResult) => {
            console.log(finalResult);
            if (finalResult.length > 0) {
              res
                .status(200)
                .send({ message: 'Eureka, I Found them!', finalResult });
            } else {
              res
                .status(404)
                .send({ message: "We couldn't find any articles." });
            }
          });
        })
        .catch(() => res.status(404).send({ message: "We couldn't find any articles." }));
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
                tag: {
                  $contains: tag
                }
              }
            }
          }).then((finalResult) => {
            if (finalResult.length > 0) {
              res
                .status(200)
                .send({ message: 'Eureka, I Found them!', finalResult });
            } else {
              res
                .status(404)
                .send({ message: "We couldn't find any articles." });
            }
          });
        })
        .catch(() => res.status(404).send({ message: "We couldn't find any articles." }));
    } else if (tag !== 'false' && article !== 'false') {
      // Search by tag and article
      Articles.findAll({
        where: {
          [Op.and]: {
            tag: {
              $contains: tag
            },
            title: {
              [Op.iLike]: `%${article}%`
            }
          }
        }
      }).then((finalResult) => {
        if (finalResult.length > 0) {
          res
            .status(200)
            .send({ message: 'Eureka, I Found them!', finalResult });
        } else {
          res.status(404).send({ message: "We couldn't find any articles." });
        }
      });
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
      }).then((result) => {
        console.log(result[0].dataValues);
        Articles.findAll({
          where: {
            authorId: result[0].dataValues.id
          }
        }).then((finalResult) => {
          if (finalResult.length > 0) {
            res
              .status(200)
              .send({ message: 'Eureka, I Found them!', finalResult });
          } else {
            res.status(404).send({ message: "We couldn't find any articles." });
          }
        });
      });
    } else if (article !== 'false') {
      // Search by article
      Articles.findAll({
        where: {
          title: {
            [Op.iLike]: `%${article}%`
          }
        }
      }).then((finalResult) => {
        if (finalResult.length > 0) {
          res
            .status(200)
            .send({ message: 'Eureka, I Found them!', finalResult });
        } else {
          res.status(404).send({ message: "We couldn't find any articles." });
        }
      });
    } else if (tag !== 'false') {
      // Search by tag
      Articles.findAll({
        where: {
          tag: {
            $contains: tag
          }
        }
      }).then((finalResult) => {
        if (finalResult.length > 0) {
          res
            .status(200)
            .send({ message: 'Eureka, I Found them!', finalResult });
        } else {
          res.status(404).send({ message: "We couldn't find any articles." });
        }
      });
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

export default searchArticles;
