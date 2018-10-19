import eventEmitter from './eventEmitter';
import helper from './helper.js';
import utility from './utility';
import { newArticleEmail } from './templates';
import { User, UserNotification } from '../models';

export default () => {
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
      .sendEmail(follower.email,
        newArticleEmail(follower.firstName, authorFullName, title, articleSlug)));

    UserNotification.bulkCreate(followersNotification, { returning: true });
  });

  eventEmitter.on('notification created', notification => console.log('notification created', notification));
};
