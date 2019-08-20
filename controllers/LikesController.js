import models from '../database/models';
import ServerResponse from '../modules';

const {
  Article,
  Like,
} = models;
const { errorResponse, successResponse } = ServerResponse;

/**
 * @class likeController
 * @exports likeController
 */
export default class likeController {
  /**
   *
   * @method likePost
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {function} next
   * @returns {object} returns...
   */
  static async likeArticle(req, res, next) {
    try {
      const { slug } = req.params;
      const userId = req.user.id;

      const article = await Article.findOne({ where: { slug } });
      if (!article) return errorResponse(res, 404, { message: 'Article not found' });

      const articleId = article.dataValues.id;

      const previousChoice = await Like.findOne({ where: { userId, articleId } });

      // Check for previous like on article and undo
      if (previousChoice && (previousChoice.like === true)) {
        await Like.destroy({ where: { userId, articleId } });

        // Update count on article table
        await Article.update(
          { likes: (article.dataValues.likes - 1) },
          { where: { slug } },
        );

        return successResponse(
          res, 200, 'article',
          { message: `Your like on '${article.dataValues.title}' has been removed` }
        );
      }
      // Check if user previously disliked article (change dislike to like if true)
      if (previousChoice && (previousChoice.like === false)) {
        await Like.update(
          { like: true },
          { where: { userId, articleId } },
        );

        // Update count on article table
        await Article.update(
          {
            likes: (article.dataValues.likes + 1),
            dislikes: (article.dataValues.dislikes - 1),
          },
          { where: { slug } },
        );
        return successResponse(
          res, 201, 'article',
          { message: `You just liked '${article.dataValues.title}'` }
        );
      }

      // Create new like if all above checks fail
      await Like.create({
        articleId,
        userId,
        like: true,
      });

      // Update count on article table
      await Article.update(
        { likes: (article.dataValues.likes + 1) },
        { where: { slug } },
      );

      return successResponse(
        res, 201, 'article',
        { message: `You just liked '${article.dataValues.title}'` }
      );
    } catch (error) {
      return next(error);
    }
  }

  /**
   *
   * @method dislikePost
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {function} next
   * @returns {object} returns...
   */
  static async dislikeArticle(req, res, next) {
    try {
      const { slug } = req.params;
      const userId = req.user.id;

      const article = await Article.findOne({ where: { slug } });
      if (!article) return errorResponse(res, 404, { message: 'Article not found' });

      const articleId = article.dataValues.id;

      const previousChoice = await Like.findOne({ where: { userId, articleId } });

      // Check for previous dislike on article and undo
      if (previousChoice && (previousChoice.like === false)) {
        await Like.destroy({ where: { userId, articleId } });
        // Update count on article table
        await Article.update(
          { dislikes: (article.dataValues.dislikes - 1) },
          { where: { slug } },
        );

        return successResponse(
          res, 200, 'article',
          { message: `Your dislike on '${article.dataValues.title}' has been removed` }
        );
      }
      // Check if user previously liked article (change like to dislike if true)
      if (previousChoice && (previousChoice.like === true)) {
        await Like.update(
          { like: false },
          { where: { userId, articleId } },
        );
        // Update count on article table
        await Article.update(
          {
            likes: (article.dataValues.likes - 1),
            dislikes: (article.dataValues.dislikes + 1),
          },
          { where: { slug } },
        );

        return successResponse(
          res, 201, 'article',
          { message: `You just disliked '${article.dataValues.title}'` }
        );
      }

      // Create new dislike if all above checks fail
      await Like.create({
        articleId,
        userId,
        like: false,
      });

      // Update count on article table
      await Article.update(
        { dislikes: (article.dataValues.dislikes + 1) },
        { where: { slug } },
      );

      return successResponse(
        res, 201, 'article',
        { message: `You just disliked '${article.dataValues.title}'` }
      );
    } catch (error) {
      return next(error);
    }
  }
}
