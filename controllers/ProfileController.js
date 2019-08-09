import models from '../database/models';
import ServerResponse from '../modules';

const { successResponse, errorResponse } = ServerResponse;
/**
 * @class ProfileController
 * @exports ProfileController
 */
export default class ProfileController {
  /**
   *
   * @method createProfile
   * @description Create a profile for registered user
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {function} next
   * @returns {object} returns profile info
   * @memberof ProfileController
   */
  static async createProfile(req, res, next) {
    try {
      const { id } = req.user;
      const { dataValues } = await models.User.findOne({ where: { id } });
      if (!dataValues.isVerified) {
        return errorResponse(res, 401, 'You need to verify your account first');
      }
      const { avatar, bio } = req.body;
      const profileExist = await models.Profile.findOne({ where: { userId: id } });
      if (profileExist) {
        return errorResponse(res, 409, 'Profile already exists');
      }
      await models.Profile.create({
        userId: id,
        avatar,
        bio,
      });
      const { firstName, lastName } = req.user;
      const resData = {
        message: 'Your profile has been created successfully',
        profile: {
          name: `${firstName} ${lastName}`,
          bio,
          avatar,
        },
      };
      return successResponse(res, 201, 'user', resData);
    } catch (error) {
      return next(error);
    }
  }

  /**
   *
   * @method editProfile
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {function} next
   * @returns {object} returns profile info
   */
  static async editProfile(req, res, next) {
    try {
      const { id } = req.params;
      const hasProfile = await models.Profile.findOne({ where: { userId: id } });

      if (id !== req.user.id) {
        return errorResponse(res, 403, 'You are not allowed to edit this profile');
      }

      if (!hasProfile) {
        return errorResponse(res, 404, 'You don\'t have a profile, please create a profile');
      }

      const {
        avatar,
        bio,
        firstName,
        lastName,
      } = req.body;

      await models.Profile.update(
        { bio, avatar },
        { where: { userId: id } },
      );

      await models.User.update(
        { firstName, lastName },
        { where: { id } },
      );
      const { dataValues: userData } = await models.User.findOne({ where: { id } });
      const { dataValues: profileData } = await models.Profile.findOne({ where: { userId: id } });
      const { firstName: firstNamedb, lastName: lastNamedb } = userData;
      const { avatar: avatardb, bio: biodb } = profileData;
      const resData = {
        message: 'Your profile has been updated successfully',
        profile: {
          avatar: avatardb,
          bio: biodb,
          firstName: firstNamedb,
          lastName: lastNamedb,
        },
      };
      return successResponse(res, 200, 'user', resData);
    } catch (error) {
      return next(error);
    }
  }


  /**
   *
   * @method viewProfile
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {function} next
   * @returns {object} returns profile info
   */
  static async viewProfile(req, res, next) {
    try {
      const { id } = req.params;
      const profileData = await models.Profile.findOne({ where: { userId: id } });
      return res.status(200).json({
        message: 'Profile fetched successfully',
        profile: {
          ...profileData.dataValues,
        },
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @method articlesUserRead
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {function} next
   * @returns {object} returns object response
   */
  static async articlesUserRead(req, res, next) {
    const userId = req.user.id;
    try {
      const getStatistics = await models.Reading.findAll({ raw: true, where: { userId } });
      return successResponse(res, 200, 'articlesRead', getStatistics.length);
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @method articlesReadCount
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {function} next
   * @returns {object} returns object response
   */
  static async articlesReadCount(req, res, next) {
    const userId = req.user.id;
    try {
      const authorArticlesDetails = await models.Article.findAll({
        raw: true,
        where: { userId },
        attributes: ['title', 'id', 'readCount', 'slug', 'userId']
      });
      successResponse(res, 200, 'allArticlesStatistics', authorArticlesDetails);
    } catch (error) {
      return next(error);
    }
  }
}
