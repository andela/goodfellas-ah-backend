import eventEmitter from './eventEmitter';
import helper from './helper.js';
import utility from './utility';
import { newArticleEmail } from './templates';

export default () => {
  eventEmitter.on('article created', async (authorId, articleSlug, title) => {
    const followers = await helper.getRawFollowers(authorId);
    const followersEmail = followers
      .filter(each => each['follower.notificationSettings']
        .findIndex(setting => setting === 'email') >= 0)
      .map(each => ({ email: each['follower.email'], firstName: each['follower.firstname'] }));

    followersEmail.forEach(follower => utility
      .sendEmail(follower.email,
        newArticleEmail(follower.firstName, authorId, title, articleSlug)));

    const followersNotification = followers
      .filter(each => each['follower.notificationSettings']
        .findIndex(setting => setting === 'inApp') >= 0)
      .map(each => ({
        userId: each.followerId,
        articleSlug,
        authorId,
        articleTitle: title
      }));
  });
};
