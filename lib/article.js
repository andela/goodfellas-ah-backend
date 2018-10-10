const db = require('../models');

const { Articles } = db;
// finds article by ID
module.exports = {
  async findArticle(articleId) {
    const existingArticle = await Articles.findOne({ where: { id: articleId } });
    return existingArticle;
  },
};
