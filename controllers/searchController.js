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
    try {
      const {
        keyword, customFilter,
      } = req.query;
      if (keyword === '') {
        return errorResponse(res, 400, { message: 'Please input a search parameter' });
      }
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

      // search by custom filter
      // custom filter is either Author, Tag, Title
      if (customFilter === 'title') {
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
        return successResponse(res, 200, 'matches', {
          articles,
        });
      }

      if (customFilter === 'tag') {
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
        return successResponse(res, 200, 'matches', {
          tags,
        });
      }

      if (customFilter === 'author') {
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
        return successResponse(res, 200, 'matches', {
          authors,
        });
      }

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

      return successResponse(res, 200, 'matches', {
        articles,
        authors,
        tags,
      });
    } catch (err) {
      return next(err);
    }
  }
}

export default SearchController;
