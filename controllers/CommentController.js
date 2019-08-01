import models from '../database/models';
import ServerResponse from '../modules';

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
      const userId = req.user.id;

      const article = await models.Article.findOne({ where: { slug } });
      if (!article) return notFoundError(req, res);

      if (article.dataValues.status !== 'published') return errorResponse(res, 405, 'cannot comment on a draft article');

      const articleComment = await models.Comment.create({
        body,
        userId,
        articleId: article.dataValues.id,
        articleSlug: slug,
      });

      return successResponse(res, 201, 'comment', articleComment.dataValues);
    } catch (error) {
      return next(error);
    }
  }
}
