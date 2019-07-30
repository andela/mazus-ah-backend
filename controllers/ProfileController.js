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
   * @returns {object} returns profile info
   * @memberof ProfileController
   */
  static async createProfile(req, res) {
    const { avatar, bio } = req.body;
    const { id } = req.user;
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
    return successResponse(res, 201, resData);
  }

  /**
   *
   * @method editProfile
   * @param {object} req express request object
   * @param {object} res express response object
   * @returns {object} returns profile info
   */
  static async editProfile(req, res) {
    const {
      avatar, bio, firstName, lastName,
    } = req.body;
    let { id } = req.params;
    id = parseInt(id, 10);
    if (id !== req.user.id) {
      return errorResponse(res, 403, 'You are not allowed to edit this profile');
    }
    await models.Profile.update(
      { bio, avatar },
      { where: { userId: id } },
    );

    await models.User.update(
      { firstName, lastName },
      { where: { id } },
    );
    const { dataValues } = await models.User.findOne({ where: { id } });
    const resData = {
      message: 'Your profile has been updated successfully',
      profile: {
        avatar,
        bio,
        firstName: dataValues.firstName,
        lastName: dataValues.lastName,
      },
    };
    return successResponse(res, 200, resData);
  }


  /**
   *
   * @method viewProfile
   * @param {object} req express request object
   * @param {object} res express response object
   * @returns {object} returns profile info
   */
  static async viewProfile(req, res) {
    const { id } = req.params;
    const profileData = await models.Profile.findOne({ where: { userId: id } });
    return res.status(200).json({
      message: 'Profile fetched successfully',
      profile: {
        ...profileData.dataValues,
      },
    });
  }
}
