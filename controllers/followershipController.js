import models from '../database/models';

const { User, Follower } = models;

/**
 * @exports
 * @class Followership
 *
 */
export default class Followership {
  /**
     * @static
     *
     * @description allows a user follow another user
     *
     * @param {object} req request object
     * @param {object} res response object
     * @returns {object} returns follow data
     *
     * @memberof Followership
     */
  static async follow(req, res) {
    const { id } = req.params;
    const { id: userid } = req.user;

    const foundUser = await User.findOne({ where: { id } });
    const foundMe = await User.findOne({ where: { id: userid } });
    if (!foundUser) {
      return res.status(404).send({
        errors: {
          message: 'This author does not exist',
        }
      });
    }
    const { isVerified } = foundMe;
    if (!isVerified) {
      return res.status(400).send({
        errors: {
          message: 'You are supposed to verify your account to follow your favourite authors',
        }
      });
    }
    if (id === userid) {
      return res.status(400).send({
        errors: {
          message: 'You are not allowed to follow yourself',
        }
      });
    }

    await Follower.findOrCreate({ where: { followerId: userid, userId: id } })
      // eslint-disable-next-line no-unused-vars
      .then(([follow, created]) => {
        if (created) {
          return res.status(201).send({
            follows: {
              message: 'You followed a new author',
            }
          });
        }
        return res.status(400).send({
          errors: {
            message: 'You already follow this author',
          }
        });
      });
  }

  /**
   *
   *
   * @static
   * @description allows a user to unfollow another user
   *
   * @param {object} req request object
   * @param {object} res response object
   * @returns {object} unfollow data
   *
   * @memberof Followership
   */
  static async unfollow(req, res) {
    const { id } = req.params;
    const { id: userid } = req.user;

    const foundUser = await User.findOne({ where: { id } });
    const foundMe = await User.findOne({ where: { id: userid } });
    if (!foundUser) {
      return res.status(404).send({
        errors: {
          message: 'This author does not exist',
        }
      });
    }
    const { isVerified } = foundMe;
    if (!isVerified) {
      return res.status(400).send({
        errors: {
          message: 'You are supposed to verify your account before you can perform this action',
        }
      });
    }
    const deleteFollow = await Follower.destroy({ where: { followerId: userid, userId: id } });
    if (deleteFollow <= 0) {
      return res.status(400).send({
        errors: {
          message: 'You have already unfollowed this author',
        }
      });
    }

    return res.status(200).send({
      follows: {
        message: 'You have unfollowed this author',
      }
    });
  }

  /**
   * @static
   * @description allows users to view their followers
   *
   * @param {object} req request object
   * @param {object} res response object
   * @returns {object} followers data
   *
   * @memberof Followership
   */
  static async getUserFollowers(req, res) {
    const { id } = req.params;
    const foundUser = await User.findOne({ where: { id } });
    if (!foundUser) {
      return res.status(404).send({
        errors: {
          message: 'this author does not exist',
        }
      });
    }
    const userFollowers = await Follower.findAll({
      where: { userId: id },
      include: [
        {
          model: User,
          as: 'followings',
          attributes: ['id', 'firstName', 'lastName']
        }
      ]
    });

    return res.status(200).send({
      follows: {
        message: 'Users followers',
        userFollowers
      }
    });
  }

  /**
   * @static
   * @description allows users to view people they follow
   *
   * @param {object} req request object
   * @param {object} res response object
   * @returns {object} followers data
   *
   * @memberof Followership
   */
  static async getUserFollowings(req, res) {
    const { id } = req.params;
    const foundUser = await User.findOne({ where: { id } });
    if (!foundUser) {
      return res.status(404).send({
        errors: {
          message: 'this author does not exist',
        }
      });
    }
    const userFollowings = await Follower.findAll({
      where: { followerId: id },
      include: [
        {
          model: User,
          as: 'followings',
          attributes: ['id', 'firstName', 'lastName']
        }
      ]
    });

    return res.status(200).send({
      follows: {
        message: 'User is following',
        userFollowings
      }
    });
  }
}
