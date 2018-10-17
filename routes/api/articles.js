import multiparty from 'connect-multiparty';
import articleController from '../../controllers/articleController';
import authenticate from '../../middleware/authentication';
import { checkNullInput } from '../../middleware/validation';

const router = require('express').Router();

const multipart = multiparty();

router.post('/articles', authenticate, multipart, checkNullInput, articleController.createArticle);
router.put('/articles/:slug', authenticate, multipart, checkNullInput, articleController.updateArticle);
router.delete('/articles/:slug', authenticate, articleController.deleteArticle);
router.get('/articles', authenticate, articleController.getAllArticles);
router.get('/articles/:slug', authenticate, articleController.getAnArticle);


export default router;
