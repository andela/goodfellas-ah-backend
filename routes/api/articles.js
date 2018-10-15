import articleController from '../../controllers/articleController';
import authenticate from '../../middleware/authentication';

const router = require('express').Router();

const { checkNullInput, checkIfArticleExist, getUserRating } = require('../../middleware/validation');


router.post('/articles', authenticate, checkNullInput, articleController.createArticle);
router.put('/articles/:slug', authenticate, checkNullInput, articleController.updateArticle);
router.delete('/articles/:slug', authenticate, articleController.deleteArticle);
router.get('/articles', authenticate, articleController.getAllArticles);
router.get('/articles/:slug', authenticate, articleController.getAnArticle);
router.post('/articles/:articleId/rating', authenticate, checkIfArticleExist, getUserRating, articleController.postRating);


export default router;
