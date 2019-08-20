import { Op, Sequelize } from 'sequelize';
import ServerResponse from '../modules';
import models from '../database/models';

const {
  User,
  Article,
  Tag,
  Profile
} = models;
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
      const tagsListToString = Sequelize.fn('lower', Sequelize.fn('array_to_string', Sequelize.col('tagsList'), '|'));
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
        ],
        order: [
          ['createdAt', 'DESC'],
        ],
      });
      const tags = await Article.findAll({
        attributes: articleAttributes,
        where: Sequelize.where(tagsListToString, { [Op.iLike]: `%${keyword.toLowerCase()}%` }),
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['firstName', 'lastName'],
          }
        ],
        order: [
          ['createdAt', 'DESC'],
        ],
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
          },
          {
            model: Profile,
            as: 'profile',
            attributes: ['bio', 'avatar']
          }
        ],
        order: [
          ['createdAt', 'DESC'],
        ],
      });
      if (customFilter === 'title') {
        return successResponse(res, 200, 'matches', {
          articles,
        });
      }

      if (customFilter === 'tag') {
        return successResponse(res, 200, 'matches', {
          tags,
        });
      }

      if (customFilter === 'author') {
        return successResponse(res, 200, 'matches', {
          authors,
        });
      }
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
