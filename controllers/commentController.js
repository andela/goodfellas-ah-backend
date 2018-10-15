import db from '../models';
import utility from '../lib/utility';
import helper from '../lib/helper';

const {
  ArticleComment, CommentReply, User, Profiles
} = db;

const userAttributes = ['firstname', 'lastname', 'email'];
const profileAtrributes = ['username', 'bio', 'image'];

exports.postComment = async (req, res) => {
  try {
    const values = utility.trimValues(req.body);
    const { body } = values;
    const { slug } = req.params;
    const { userId } = req;
    const existingArticle = await helper.findArticleSlug(slug);
    if (!existingArticle) {
      return res.status(400).json({
        error: true,
        message: 'Article does not exist'
      });
    }
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
    const existingArticle = await helper.findArticleSlug(slug);
    if (!existingArticle) {
      return res.status(400).json({
        error: true,
        message: 'Article does not exist'
      });
    }
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
    const existingArticle = await helper.findArticleSlug(slug);
    const existingComment = await helper.findComment(commentId, slug);
    if (!existingArticle) {
      return res.status(400).json({
        error: true,
        message: 'Article does not exist'
      });
    }
    if (!existingComment) {
      return res.status(400).json({
        error: true,
        message: 'Comment does not exist'
      });
    }
    if (existingComment.user_id !== userId) {
      return res.status(400).json({
        error: true,
        message: 'You don\'t have the authorization to delete this comment'
      });
    }
    await ArticleComment.destroy({
      where: {
        article_slug: slug,
        user_id: userId,
        id: commentId
      }
    });
    res.status(200).json({
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
    const existingArticle = await helper.findArticleSlug(slug);
    const existingComment = await helper.findComment(commentId);
    if (!existingArticle) {
      return res.status(400).json({
        error: true,
        message: 'Article does not exist'
      });
    }
    if (!existingComment) {
      return res.status(400).json({
        error: true,
        message: 'Comment does not exist'
      });
    }
    if (existingComment.user_id !== userId) {
      return res.status(400).json({
        error: true,
        message: 'You don\'t have the authorization to update this comment'
      });
    }
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
    const existingComment = await helper.findComment(commentId);
    if (!existingComment) {
      return res.status(400).json({
        error: true,
        message: 'Comment does not exist'
      });
    }
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

exports.updateReply = async (req, res) => {
  try {
    const { userId } = req;
    const { body } = req.body;
    const { replyId } = req.params;
    const existingReply = await helper.findReply(replyId);
    if (!existingReply) {
      return res.status(400).json({
        error: true,
        message: 'Reply does not exist'
      });
    }
    if (existingReply.user_id !== userId) {
      return res.status(400).json({
        error: true,
        message: 'You don\'t have the authorization to update this reply'
      });
    }
    const reply = await CommentReply.update(
      { body },
      {
        returning: true,
        where: {
          user_id: userId,
          id: replyId
        }
      }
    );
    res.status(200).json({
      error: false,
      message: 'reply updated successfully',
      reply
    });
  } catch (error) {
    res.send(error);
  }
};

exports.deleteReply = async (req, res) => {
  try {
    const { replyId } = req.params;
    const { userId } = req;
    const existingReply = await helper.findReply(replyId);
    if (!existingReply) {
      return res.status(400).json({
        error: true,
        message: 'Reply does not exist'
      });
    }
    if (existingReply.user_id !== userId) {
      return res.status(400).json({
        error: true,
        message: 'You don\'t have the authorization to delete this reply'
      });
    }
    await CommentReply.destroy({
      where: {
        user_id: userId,
        id: replyId
      }
    });
    res.status(200).json({
      error: false,
      message: 'reply deleted successfully'
    });
  } catch (error) {
    res.send(error);
  }
};


exports.getReply = async (req, res) => {
  try {
    const { commentId } = req.params;
    const reply = await CommentReply.findAll({
      where: { comment_id: commentId },
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
      ],
    });
    if (reply.length < 1) {
      return res.status(404).send({ message: 'This comment has no reply' });
    }
    res.status(200).json({
      error: false,
      message: 'reply retrieved successfully',
      reply,
    });
  } catch (error) {
    res.send(error);
  }
};
