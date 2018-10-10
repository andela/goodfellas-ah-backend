import {
  createArticle,
  modifyArticle,
  deleteArticle,
  getAllArticles,
  getAnArticle
} from '../../controllers/articleController';
import authenticate from '../../middleware/authentication';
import { checkNullInput } from '../../middleware/validation';

const router = require('express').Router();

router.post('/articles', authenticate, checkNullInput, createArticle);
router.put('/articles/:articleId', authenticate, checkNullInput, modifyArticle);
router.delete('/articles/:articleId', authenticate, deleteArticle);
router.get('/articles', authenticate, getAllArticles);
router.get('/articles/:articleId', authenticate, getAnArticle);


export default router;
