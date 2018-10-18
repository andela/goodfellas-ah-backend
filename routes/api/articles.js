import multiparty from 'connect-multiparty';
import articleController from '../../controllers/articleController';
import commentController from '../../controllers/commentController';
import authenticate, { allowVisitors } from '../../middleware/authentication';
import { checkNullInput, commentValidation, reactionValidation } from '../../middleware/validation';

const router = require('express').Router();

const multipart = multiparty();

router.post('/articles', authenticate, multipart, checkNullInput, articleController.createArticle);
router.put('/articles/:slug', authenticate, multipart, checkNullInput, articleController.updateArticle);
router.delete('/articles/:slug', authenticate, articleController.deleteArticle);
router.get('/articles', allowVisitors, articleController.getAllArticles);
router.get('/articles/:slug', allowVisitors, articleController.getAnArticle);
router.post('/articles/:slug/react', authenticate, reactionValidation, articleController.reactToArticle);
router.post('/articles/:slug/bookmark', authenticate, articleController.bookmarkArticle);
router.delete('/articles/:slug/bookmark', authenticate, articleController.deleteBookmark);
router.get('/articles/all/bookmark', authenticate, articleController.getBookmarks);

router.post('/articles/:slug/comments', authenticate, commentValidation, commentController.postComment);
router.get('/articles/:slug/comments', commentController.getComment);
router.delete('/articles/:slug/comments/:commentId', authenticate, commentController.deleteComment);
router.put('/articles/:slug/comments/:commentId', authenticate, commentController.updateComment);


router.post('/articles/comments/reply/:commentId', authenticate, commentController.replyComment);

router.put('/articles/comments/reply/:replyId', authenticate, commentController.updateReply);
router.delete('/articles/comments/reply/:replyId', authenticate, commentController.deleteReply);

router.get('/articles/comments/reply/:commentId', commentController.getReply);

router.post('/articles/:slug/comments/react/:commentId', authenticate, reactionValidation, commentController.commentReaction);

export default router;
