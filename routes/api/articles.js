import articleController from '../../controllers/articleController';
import authenticate from '../../middleware/authentication';
import { checkNullInput, reactionValidation } from '../../middleware/validation';

const router = require('express').Router();

router.post('/articles', authenticate, checkNullInput, articleController.createArticle);
router.put('/articles/:slug', authenticate, checkNullInput, articleController.updateArticle);
router.delete('/articles/:slug', authenticate, articleController.deleteArticle);
router.get('/articles', authenticate, articleController.getAllArticles);
router.get('/articles/:slug', authenticate, articleController.getAnArticle);
router.post('/articles/:slug/react', authenticate, reactionValidation, articleController.reactToArticle);
router.post('/articles/:slug/bookmark', authenticate, articleController.bookmarkArticle);
router.delete('/articles/:slug/bookmark', authenticate, articleController.deleteBookmark);
router.get('/articles/all/bookmark', authenticate, articleController.getBookmarks);

export default router;
