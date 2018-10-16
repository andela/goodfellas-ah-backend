import articleController from '../../controllers/articleController';
import authenticate from '../../middleware/authentication';
import { checkNullInput, tagValidation } from '../../middleware/validation';

const router = require('express').Router();

router.post('/articles', authenticate, checkNullInput, articleController.createArticle);
router.put('/articles/:slug', authenticate, checkNullInput, articleController.updateArticle);
router.delete('/articles/:slug', authenticate, articleController.deleteArticle);
router.get('/articles', authenticate, articleController.getAllArticles);
router.get('/articles/:slug', authenticate, articleController.getAnArticle);
router.post('/articles/:slug/tags', authenticate, tagValidation, articleController.addArticleTags);


export default router;
