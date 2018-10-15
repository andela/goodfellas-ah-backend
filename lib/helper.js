import {
  User,
  FollowersTable,
  Profiles,
  Articles,
  Rating
} from '../models';

const findUser = async (email) => {
  const existingUser = await User.findOne({ where: { email } });
  return existingUser;
};
const throwErrorOnBadRequest = async (followerId, followedUserId) => {
  if (Number(followedUserId) === Number(followerId)) throw new Error('Error: You cannot follow yourself');
  const existingFollow = await FollowersTable.findOne({ where: { followerId, followedUserId } });
  if (existingFollow) throw new Error('Error: You\'re already following this user');
};
const throwErrorOnNonExistingUser = async (userId) => {
  const existingUser = await User.findById(userId);
  if (!existingUser) throw new Error('Error: User doen\'t exist');
  return existingUser;
};
const findProfile = async (userId) => {
  const existingUser = await Profiles.findOne({ where: { userId } });
  return existingUser;
};
const findArticle = async (slug) => {
  const existingArticle = await Articles.findOne({ where: { slug }, 
    include: [{ model: Rating, as: 'star_ratings' }] });
  return existingArticle;
};

const updateRating = (rating, userRating) => {
  return rating.update({
    starRating: userRating
  }).then(() => {
      return true;
  });    
};

const addRating = (userRating, userId, articleId) => {
  return Rating.create({
    userId: userId,
    articleId: articleId,
    starRating: userRating,
  }).then(() => {
    return true;
});   
};

export default {
  findUser,
  throwErrorOnBadRequest,
  throwErrorOnNonExistingUser,
  findProfile,
  findArticle,
  updateRating,
  addRating
};
