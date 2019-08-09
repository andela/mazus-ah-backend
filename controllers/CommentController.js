import models from '../database/models';
import ServerResponse from '../modules';
import Notification from '../helpers/Notification';

const { successResponse, notFoundError, errorResponse } = ServerResponse;
const {
  Comment,
  Like,
  Article,
} = models;

/**
 * @class CommentController
 * @exports CommentController
 */
export default class CommentController {
  /**
   *
   * @method postComment
   * @description Posts a comment
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {fucntion} next
   * @returns {object} returns comment info
   * @memberof commentController
   */
  static async postComment(req, res, next) {
    try {
      const { body } = req.body;
      const { slug } = req.params;
      const { id: userId, firstName, lastName } = req.user;

      const article = await Article.findOne({ where: { slug } });
      if (!article) return notFoundError(req, res);
      const { id, title, status } = article.dataValues;
      if (status !== 'published') return errorResponse(res, 405, 'cannot comment on a draft article');

      const articleComment = await Comment.create({
        body,
        userId,
        articleId: id,
        articleSlug: slug,
      });
      Notification.newComment(slug, id, title, firstName, lastName);

      return successResponse(res, 201, 'comment', articleComment.dataValues);
    } catch (error) {
      return next(error);
    }
  }


  /**
   * Method to like a single comment
   *
   * @static
   * @param {object} req
   * @param {object} res
   * @param {function} next
   * @returns {object} details of the liked comment
   * @memberof CommentController
   */
  static async likeComment(req, res, next) {
    try {
      const { commentId } = req.params;
      const { id } = req.user;

      const foundComment = await Comment.findOne({
        where: {
          id: commentId,
        }
      });

      if (!foundComment) {
        return errorResponse(res, 404, { comment: 'That comment does not exist' });
      }

      const alreadyLiked = await Like.findOne({
        where: {
          commentId,
          userId: id,
        }
      });

      if (alreadyLiked) {
        await Like.destroy({
          where: {
            commentId
          }
        });

        await Comment.update(
          {
            likes: foundComment.dataValues.likes - 1,
          },
          {
            where: {
              id: foundComment.dataValues.id,
            }
          }
        );

        return successResponse(res, 200, 'comment', { message: '\'Like\' has been removed' });
      }

      const like = await Like.create({
        commentId,
        userId: id,
        like: true,
      });

      await Comment.update(
        {
          likes: foundComment.dataValues.likes + 1,
        },
        {
          where: {
            id: foundComment.dataValues.id,
          }
        }
      );
      return successResponse(res, 201, 'comment', { message: 'Comment liked', like });
    } catch (err) {
      return next(err);
    }
  }
}
