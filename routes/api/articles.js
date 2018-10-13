import articleController from '../../controllers/articleController';
import commentController from '../../controllers/commentController';
import authenticate from '../../middleware/authentication';
import { checkNullInput } from '../../middleware/validation';

const router = require('express').Router();

router.post('/articles', authenticate, checkNullInput, articleController.createArticle);
router.put('/articles/:articleId', authenticate, checkNullInput, articleController.updateArticle);
router.delete('/articles/:articleId', authenticate, articleController.deleteArticle);
router.get('/articles', authenticate, articleController.getAllArticles);
router.get('/articles/:articleId', authenticate, articleController.getAnArticle);

router.post('/articles/:slug/comments', authenticate, commentController.postComment);
router.get('/articles/:slug/comments', commentController.getComment);
router.post('/articles/comments/reply/:commentId', authenticate, commentController.commentReply);

export default router;
