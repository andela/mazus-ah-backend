import { Op } from 'sequelize';
import ServerResponse from '../modules';
import models from '../database/models';

const { User, Article, Tag } = models;
const { successResponse, errorResponse } = ServerResponse;

/**
 * perform custom search sitewide
 *
 * @param {Object} req Express request
 * @param {Object} res Express object
 * @param {Object} next Express object
 * @returns {Array} articles, authors and tags
 */
export default async (req, res, next) => {
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
      'readTime',
      'createdAt'
    ];

    const userAttributes = ['firstName', 'lastName'];

    const tagAttributes = ['name'];

    const articles = await Article.findAll({
      attributes: articleAttributes,
      where: {
        title: {
          [Op.iLike]: `%${keyword}%`
        }
      },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['firstName', 'lastName']
        }
      ]
    });

    const authors = await User.findAll({
      attributes: userAttributes,
      where: {
        [Op.or]: [
          {
            firstName: {
              [Op.iLike]: `%${keyword}%`
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
          attributes: ['slug', 'title', 'description', 'body', 'readTime'],
          include: [
            {
              // user
              model: Tag,
              as: 'tags',
              attributes: ['name']
            }
          ]
        }
      ]
    });

    const tags = await Tag.findAll({
      attributes: tagAttributes,
      where: {
        name: {
          [Op.iLike]: `%${keyword}%`
        }
      }
    });
    if ((articles.length || tags.length || authors.length) === 0) {
      return errorResponse(res, 404, { message: 'No Match was found for your request!' });
    }
    return successResponse(res, 200, 'matches found', {
      keyword,
      articles,
      authors,
      tags
    });
  } catch (error) {
    return next(error);
  }
};
