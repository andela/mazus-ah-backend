import models from '../database/models';


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
    const {avatar, bio} = req.body;  
    const {id} = req.user
    const profileExist = await models.Profile.findOne({ where: { userId : id }})
    if (profileExist) {
      return res.status(409).json({
        errors: 'Profile already exist'
      })
    }
    try {
     await models.Profile.create({
        userId : id,
        avatar,
        bio
      })
      const { firstName, lastName } = {
        firstName: 'Pelumi',
        lastName: 'Alesh'
      }//req.user
      return res.status(201).json({
        message: 'Your profile has been created successfully',
        profile: {
          name: `${firstName} ${lastName}`,
          bio,
          avatar
        }
      })
    } catch (error) {
      return res.status(500).json({
        error
      })
    }
 
  }

  /**
   * 
   * @method editProfile
   * @param {object} req express request object 
   * @param {object} res express response object 
   * @returns {object} returns profile info
   */
  static async editProfile(req, res) {
    const { avatar, bio, firstName, lastName } = req.body;
    const id = 1 // req.user
    console.log('here',firstName);
    await models.Profile.update(
      { bio, avatar }, 
      { where: { userId: id }}
      );
    
     await models.User.update(
      { firstName, lastName },
      { where: { id }}
    );
    const userData = await models.User.findOne({ where: { id }});
    console.log(userData.dataValues);

    return res.status(200).json({
        message: 'Your profile has been updated successfully',
        profile: {
          avatar,
          bio,
          firstName: userData.dataValues.firstName,
          lastName: userData.dataValues.lastName
        }
      })
  }

  static async viewProfile(req, res) {
    const id = req.params.id;
    const profileData = await models.User.findOne({ where: { id }})
    return res.status(200).json({
      message: 'Profile fetched successfully',
      profile: {
        ...profileData.dataValues
      }
    });
  }
}