import models from '../database/models';
import ServerResponse from '../modules';
import Notification from '../helpers/Notification';

const { successResponse, notFoundError, errorResponse } = ServerResponse;
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

      const article = await models.Article.findOne({ where: { slug } });
      if (!article) return notFoundError(req, res);
      const { id, title, status } = article.dataValues;
      if (status !== 'published') return errorResponse(res, 405, 'cannot comment on a draft article');

      const articleComment = await models.Comment.create({
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
}
