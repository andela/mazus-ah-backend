import { Op } from 'sequelize';
import ServerResponse from '../modules';
import models from '../database/models';

const { User, Article, Tag } = models;
const { successResponse, errorResponse } = ServerResponse;

/**
 *
 *
 * @export
 * @class ArticleController
 */
class SearchController {
/**
 * perform custom search sitewide
 *
 * @param {Object} req Express request
 * @param {Object} res Express object
 * @param {Object} next Express object
 * @returns {Array} articles, authors and tags
 */
  static async customSearch(req, res, next) {
    const { keyword } = req.query;

    if (!keyword) {
      return errorResponse(res, 400, 'Please input a search parameter');
    }
    try {
      const articleAttributes = [
        'title',
        'slug',
        'body',
        'description',
        'status',
        'tagsList',
        'readTime',
        'createdAt'
      ];

      const userAttributes = ['firstName', 'lastName'];

      const articles = await Article.findAll({
        attributes: articleAttributes,
        where: {
          title: {
            [Op.iLike]: `%${keyword}%`,
          }
        },
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['firstName', 'lastName'],
          }
        ]
      });

      const authors = await User.findAll({
        attributes: userAttributes,
        where: {
          [Op.or]: [
            {
              firstName: {
                [Op.iLike]: `%${keyword}%`,
              }
            },
            {
              lastName: {
                [Op.iLike]: `%${keyword}%`
              }
            }
          ]
        },
        include: [
          {
            model: Article,
            as: 'articles',
            attributes: ['slug', 'title', 'description', 'body', 'tagsList', 'readTime'],
            include: [
              {
              // tag
                model: Tag,
                as: 'tags',
                attributes: ['name'],
              }
            ]
          }
        ]
      });

      const tags = await Article.findAll({
        attributes: articleAttributes,
        where: {
          tagsList: {
            [Op.contains]: [`${keyword}`],
          },
        },
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['firstName', 'lastName'],
          }
        ]
      });
      if ((articles.length || tags.length || authors.length) === 0) {
        return errorResponse(res, 404, { message: 'No Match was found for your request!' });
      }
      return successResponse(res, 200, 'matches', {
        keyword,
        articles,
        authors,
        tags,
      });
    } catch (error) {
      return next(error);
    }
  }
}

export default SearchController;
