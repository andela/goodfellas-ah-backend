import db from '../models';

const {
  ArticleComment, CommentReply, User, Profiles
} = db;

const userAttributes = ['firstname', 'lastname', 'email'];
const profileAtrributes = ['username', 'bio', 'image'];

exports.postComment = async (req, res) => {
  try {
    const { slug } = req.params;
    const { body } = req.body;
    const { userId } = req;
    const comment = await ArticleComment.create({
      article_slug: slug,
      body,
      user_id: userId

    });
    res.send(comment);
  } catch (error) {
    res.send(error);
  }
};


exports.getComment = async (req, res) => {
  try {
    const { slug } = req.params;
    const comments = await ArticleComment.findAll({
      where: { article_slug: slug },
      include: [{
        model: User,
        as: 'user',
        attributes: userAttributes,
        include: [{
          model: Profiles,
          as: 'profile',
          attributes: profileAtrributes
        }]
      },
      {
        model: CommentReply,
        include: [{
          model: User,
          as: 'user',
          attributes: userAttributes,
          include: [{
            model: Profiles,
            as: 'profile',
            attributes: profileAtrributes
          }]
        }]
      }
      ],
    });

    res.send(comments);
  } catch (error) {
    res.send(error);
  }
};


exports.commentReply = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { body } = req.body;
    const { userId } = req;
    const comment = await CommentReply.create({
      comment_id: commentId,
      body,
      user_id: userId

    });
    res.send(comment);
  } catch (error) {
    res.send(error);
  }
};
