import articleController from '../../controllers/articleController';
import commentController from '../../controllers/commentController';
import authenticate from '../../middleware/authentication';
import { checkNullInput, commentValidation } from '../../middleware/validation';

const router = require('express').Router();

router.post('/articles', authenticate, checkNullInput, articleController.createArticle);
router.put('/articles/:articleId', authenticate, checkNullInput, articleController.updateArticle);
router.delete('/articles/:articleId', authenticate, articleController.deleteArticle);
router.get('/articles', authenticate, articleController.getAllArticles);
router.get('/articles/:articleId', authenticate, articleController.getAnArticle);

router.post('/articles/:slug/comments', authenticate, commentValidation, commentController.postComment);
router.get('/articles/:slug/comments', commentController.getComment);
router.delete('/articles/:slug/comments/:commentId', authenticate, commentController.deleteComment);
router.put('/articles/:slug/comments/:commentId', authenticate, commentController.updateComment);


router.post('/articles/comments/reply/:commentId', authenticate, commentController.replyComment);

router.put('/articles/comments/reply/:replyId', authenticate, commentController.updateReply);
router.delete('/articles/comments/reply/:replyId', authenticate, commentController.deleteReply);

router.get('/articles/comments/reply/:commentId', commentController.getReply);

export default router;
