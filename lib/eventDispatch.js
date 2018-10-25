import eventEmitter from './eventEmitter';
import helper from './helper.js';
import utility from './utility';
import { newArticleEmail, newCommentEmail } from './templates';
import { User, UserNotification } from '../models';


export default (io) => {
  eventEmitter.on('article created', async (authorId, articleSlug, title) => {
    const author = await helper.findRecord(User, { id: authorId });
    const authorFullName = `${author.firstname} ${author.lastname}`;
    const followers = await helper.getRawFollowers(authorId);
    const followersEmail = followers
      .filter(follower => follower['follower.notificationSettings']
        .findIndex(setting => setting === 'email') >= 0)
      .map(follower => ({ email: follower['follower.email'], firstName: follower['follower.firstname'] }));

    const followersNotification = followers
      .filter(follower => follower['follower.notificationSettings']
        .findIndex(setting => setting === 'inApp') >= 0)
      .map(follower => ({
        userId: follower.followerId,
        authorId,
        articleSlug,
        type: 'followerArticle',
      }));

    followersEmail.forEach(follower => utility
      .sendEmail(
        follower.email,
        newArticleEmail(follower.firstName, authorFullName, title, articleSlug)
      ));

    UserNotification
      .bulkCreate(followersNotification, {
        returning: true
      });
  });

  eventEmitter.on('comment created', async (comment) => {
    const articleFavoriters = await helper.getArticleFavoriters(comment.article_slug);
    const favoritersEmail = articleFavoriters
      .filter((favoriter) => {
        if (favoriter['user.notificationSettings']) {
          return favoriter['user.notificationSettings']
            .findIndex(setting => setting === 'email') >= 0;
        }
        return false;
      })
      .map(user => ({ email: user['user.email'], firstName: user['user.firstname'] }));

    const favoritersNotification = articleFavoriters
      .filter((favoriter) => {
        if (favoriter['user.notificationSettings']) {
          return favoriter['user.notificationSettings']
            .findIndex(setting => setting === 'inApp') >= 0;
        }
        return false;
      })
      .map(user => ({
        userId: user['user.id'],
        articleSlug: comment.article_slug,
        commentId: comment.id,
        type: 'favoriteArticleComment',
      }));

    favoritersEmail.forEach(favoriter => utility
      .sendEmail(
        favoriter.email,
        newCommentEmail(favoriter.firstName, comment.article_slug, comment.body, comment.id)
      ));

    UserNotification
      .bulkCreate(favoritersNotification, {
        returning: true
      });
  });

  eventEmitter.on('notification created', (notifications) => {
    notifications = [].concat(notifications || []);
    notifications.forEach(async (notification) => {
      const completeNotification = await helper.getNotification({ id: notification.id });
      io.in(`userId${completeNotification.userId}`).emit('new notification', completeNotification);
    });
  });
  io.on('connection', (socket) => {
    const room = `userId${socket.userId}`;
    socket.join(room);
  });
};
