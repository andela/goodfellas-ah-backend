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
    res.status(201).json({
      error: false,
      message: 'comment posted successfully',
      comment,
    });
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

    res.status(200).json({
      error: false,
      message: 'comments retrieved successfully',
      comments,
    });
  } catch (error) {
    res.send(error);
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { userId } = req;
    const { slug } = req.params;
    await ArticleComment.destroy({
      where: {
        article_slug: slug,
        user_id: userId,
        id: commentId
      }
    });
    res.status(204).json({
      error: false,
      message: 'comment deleted successfully'
    });
  } catch (error) {
    res.send(error);
  }
};
exports.updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { userId } = req;
    const { slug } = req.params;
    const { body } = req.body;
    const comment = await ArticleComment.update(
      { body },
      {
        returning: true,
        where: {
          article_slug: slug,
          user_id: userId,
          id: commentId
        }
      }
    );
    res.status(200).json({
      error: false,
      message: 'comment updated successfully',
      comment
    });
  } catch (error) {
    res.send(error);
  }
};


exports.replyComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { body } = req.body;
    const { userId } = req;
    const reply = await CommentReply.create({
      comment_id: commentId,
      body,
      user_id: userId

    });
    res.status(200).json({
      error: false,
      message: 'reply posted successfully',
      reply,
    });
  } catch (error) {
    res.send(error);
  }
};
