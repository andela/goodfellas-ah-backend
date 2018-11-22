import utility from '../lib/utility';
import helper from '../lib/helper';
import errorMessage from '../lib/errorMessages';
import {
  ArticleComment, CommentReply, User, Profiles, Articles, CommentReaction
} from '../models';

const userAttributes = ['firstname', 'lastname', 'email'];
const profileAtrributes = ['username', 'bio', 'image'];

/**
 * posts a comment
 * @param {object} req The request body which contains the details of the comment.
 * @param {object} res The response body.
 * @returns {object} res.
 */

exports.postComment = async (req, res) => {
  try {
    const values = utility.trimValues(req.body);
    const {
      body,
      pageId,
      highlight,
      startIndex,
      endIndex
    } = values;
    const { slug } = req.params;
    const { userId } = req;
    const existingArticle = await helper.findRecord(Articles, { slug });
    if (!existingArticle) {
      return res.status(400).json(errorMessage.noArticle);
    }
    const comment = await ArticleComment.create({
      body,
      pageId,
      highlight,
      startIndex,
      endIndex,
      article_slug: slug,
      user_id: userId
    });
    res.status(201).json({
      error: false,
      message: 'comment posted successfully',
      comment
    });
  } catch (error) {
    res.send(error);
  }
};

/**
 * retrieves a comment
 * @param {object} req The request body which contains the slug of the associated article.
 * @param {object} res The response body containing the retrieved comments.
 * @returns {object} res.
 */

exports.getComment = async (req, res) => {
  try {
    const { slug } = req.params;
    const existingArticle = await helper.findRecord(Articles, { slug });
    if (!existingArticle) {
      return res.status(400).json(errorMessage.noArticle);
    }
    const comments = await ArticleComment.findAll({
      where: { article_slug: slug },
      include: [
        {
          model: User,
          as: 'user',
          attributes: userAttributes,
          include: [
            {
              model: Profiles,
              as: 'profile',
              attributes: profileAtrributes
            }
          ]
        },
        {
          model: CommentReply,
          include: [
            {
              model: User,
              as: 'user',
              attributes: userAttributes,
              include: [
                {
                  model: Profiles,
                  as: 'profile',
                  attributes: profileAtrributes
                }
              ]
            }
          ]
        },
        { model: CommentReaction }
      ]
    });

    res.status(200).json({
      error: false,
      message: 'comments retrieved successfully',
      comments
    });
  } catch (error) {
    res.send(error);
  }
};

/**
 * deletes a comment
 * @param {object} req The request body which contains the article slug, user id and comment id.
 * @param {object} res The response body with success message.
 * @returns {object} res.
 */

exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { userId } = req;
    const { slug } = req.params;
    const existingArticle = await helper.findRecord(Articles, { slug });
    const existingComment = await helper.findRecord(ArticleComment, {
      id: commentId
    });
    if (!existingArticle) {
      return res.status(400).json(errorMessage.noArticle);
    }
    if (!existingComment) {
      return res.status(400).json(errorMessage.noComment);
    }
    if (existingComment.user_id !== userId) {
      return res.status(400).json({
        error: true,
        message: "You don't have the authorization to delete this comment"
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
    res.status(500).send({ error: 'Internal server error' });
  }
};

/**
 * updates a comment
 * @param {object} req The request body which contains the article slug, user id, comment id,
 * and comment.
 * @param {object} res The response body containing the success message.
 * @returns {object} res.
 */

exports.updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { userId } = req;
    const { slug } = req.params;
    const { body } = req.body;
    const existingArticle = await helper.findRecord(Articles, { slug });
    const existingComment = await helper.findRecord(ArticleComment, {
      id: commentId
    });
    if (!existingArticle) {
      return res.status(400).json(errorMessage.noArticle);
    }
    if (!existingComment) {
      return res.status(400).json(errorMessage.noComment);
    }
    if (existingComment.user_id !== userId) {
      return res.status(400).json({
        error: true,
        message: "You don't have the authorization to update this comment"
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
    res.status(500).send({ error: 'Internal server error' });
  }
};

/**
 * replies a comment
 * @param {object} req The request body which contains the user id, comment id,
 * and comment.
 * @param {object} res The response body containing the reply.
 * @returns {object} res.
 */

exports.replyComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { body } = req.body;
    const { userId } = req;
    const existingComment = await helper.findRecord(ArticleComment, {
      id: commentId
    });
    if (!existingComment) {
      return res.status(400).json(errorMessage.noComment);
    }
    const reply = await CommentReply.create({
      comment_id: commentId,
      body,
      user_id: userId
    });
    res.status(200).json({
      error: false,
      message: 'reply posted successfully',
      reply
    });
  } catch (error) {
    res.status(500).send({ error: 'Internal server error' });
  }
};

/**
 * updates a comment reply
 * @param {object} req The request body which contains the user id, reply id,
 * and comment.
 * @param {object} res The response body containing the updated reply.
 * @returns {object} res.
 */

exports.updateReply = async (req, res) => {
  try {
    const { userId } = req;
    const { body } = req.body;
    const { replyId } = req.params;
    const existingReply = await helper.findRecord(CommentReply, {
      id: replyId
    });
    if (!existingReply) {
      return res.status(400).json(errorMessage.noReply);
    }
    if (existingReply.user_id !== userId) {
      return res.status(400).json({
        error: true,
        message: "You don't have the authorization to update this reply"
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
    res.status(500).send({ error: 'Internal server error' });
  }
};

/**
 * deletes a comment reply
 * @param {object} req The request body which contains the user id and reply id
 * @param {object} res The response body containing the success message.
 * @returns {object} res.
 */

exports.deleteReply = async (req, res) => {
  try {
    const { replyId } = req.params;
    const { userId } = req;
    const existingReply = await helper.findRecord(CommentReply, {
      id: replyId
    });
    if (!existingReply) {
      return res.status(400).json(errorMessage.noReply);
    }
    if (existingReply.user_id !== userId) {
      return res.status(400).json({
        error: true,
        message: "You don't have the authorization to delete this reply"
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
    res.status(500).send({ error: 'Internal server error' });
  }
};

/**
 * retrieves a comment reply
 * @param {object} req The request body which contains the comment id
 * @param {object} res The response body containing the reply.
 * @returns {object} res.
 */

exports.getReply = async (req, res) => {
  try {
    const { commentId } = req.params;
    const reply = await CommentReply.findAll({
      where: { comment_id: commentId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: userAttributes,
          include: [
            {
              model: Profiles,
              as: 'profile',
              attributes: profileAtrributes
            }
          ]
        }
      ]
    });
    if (reply.length < 1) {
      return res.status(404).send({ message: 'This comment has no reply' });
    }
    res.status(200).json({
      error: false,
      message: 'reply retrieved successfully',
      reply
    });
  } catch (error) {
    res.status(500).send({ error: 'Internal server error' });
  }
};

/**
 * adds a comment reaction
 * @param {object} req The request body which contains the reaction, user id, article slug
 * and comment id.
 * @param {object} res The response body containing the comment's reaction.
 * @returns {object} res.
 */

exports.commentReaction = async (req, res) => {
  try {
    const { reaction } = req.body;
    const { userId } = req;
    const { slug } = req.params;
    const { commentId } = req.params;
    const existingComment = await helper.findRecord(ArticleComment, { article_slug: slug });
    const existingReaction = await helper.findRecord(CommentReaction, {
      comment_id: commentId,
      user_id: userId
    });
    if (!existingComment) {
      return res.status(400).json(errorMessage.noComment);
    }
    // removing  a reaction
    if (existingReaction && existingReaction.reaction === reaction) {
      existingReaction.destroy();
      return res.status(200).send({ message: 'Successfully removed reaction' });
    }
    // updating a reaction
    if (existingReaction) {
      const updatedReaction = await CommentReaction.update(
        { reaction },
        {
          returning: true,
          where: {
            user_id: userId,
            comment_id: commentId
          }
        }
      );
      return res.status(200).json({
        error: false,
        message: 'reaction updated successfully',
        reaction: updatedReaction
      });
    }
    // creating a reaction
    const commentReaction = await CommentReaction.create({
      comment_id: commentId,
      reaction,
      user_id: userId
    });
    res.status(200).json({
      error: false,
      message: 'reaction posted successfully',
      reaction: commentReaction
    });
  } catch (error) {
    res.status(500).send({ error: 'Internal server error' });
  }
};
