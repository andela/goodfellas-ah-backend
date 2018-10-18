import eventEmitter from './eventEmitter';
import helper from './helper.js';
import utility from './utility';
import { newArticleEmail } from './templates';
import { User, ArticleNotification } from '../models';

export default () => {
  eventEmitter.on('article created', async (authorId, articleSlug, title) => {
    const author = await helper.findRecord(User, { id: authorId });
    const authorFullName = `${author.firstname} ${author.lastname}`;
    const followers = await helper.getRawFollowers(authorId);
    const followersEmail = followers
      .filter(each => each['follower.notificationSettings']
        .findIndex(setting => setting === 'email') >= 0)
      .map(each => ({ email: each['follower.email'], firstName: each['follower.firstname'] }));

    const followersNotification = followers
      .filter(each => each['follower.notificationSettings']
        .findIndex(setting => setting === 'inApp') >= 0)
      .map(each => ({
        userId: each.followerId,
        articleSlug,
        authorId,
        articleTitle: title
      }));

    // followersEmail.forEach(follower => utility
    //   .sendEmail(follower.email,
    //     newArticleEmail(follower.firstName, authorFullName, title, articleSlug)));

    const saveNotification = ArticleNotification.bulkCreate(followersNotification);
    console.log(saveNotification);
  });
};
