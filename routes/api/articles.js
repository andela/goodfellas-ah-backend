import articleController from '../../controllers/articleController';
import authenticate from '../../middleware/authentication';
import { checkNullInput } from '../../middleware/validation';

const router = require('express').Router();

router.post('/articles', authenticate, checkNullInput, articleController.createArticle);
router.put('/articles/:articleId', authenticate, checkNullInput, articleController.modifyArticle);
router.delete('/articles/:articleId', authenticate, articleController.deleteArticle);
router.get('/articles', authenticate, articleController.getAllArticles);
router.get('/articles/:articleId', authenticate, articleController.getAnArticle);


export default router;
