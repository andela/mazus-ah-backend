import models from '../database/models';

const {
  Bookmark,
  Rating,
  Like,
  Follower,
} = models;

let userId;
let articleId;
let authorId;
/**
 * @class Notification
 * @exports Notification
 */
class GetArticleStat {
  /**
   *Method To fetch rate
   *
   * @param {string} userID the user Id
   * @param {string} articleID the article Id
   * @param {string} authorID the author's Id
   * @static
   * @returns {string} returns the rate
   * @memberof GetArticleStat
   */
  static async populateData(userID, articleID, authorID) {
    userId = userID;
    articleId = articleID;
    authorId = authorID;
  }

  /**
   *Method To fetch rate
   *
   * @static
   * @returns {string} returns the rate
   * @memberof GetArticleStat
   */
  static async getRate() {
    const res = await Rating.findOne({
      raw: true,
      where: { userId, articleId },
      attributes: ['rate']
    });

    return res;
  }

  /**
   *Method To fetch like status
   *
   * @static
   * @returns {string} returns the like status
   * @memberof GetArticleStat
   */
  static async getLike() {
    const res = await Like.findOne({
      raw: true,
      where: { userId, articleId },
      attributes: ['like']
    });
    return res;
  }

  /**
   *Method To fetch follow status
   *
   * @static
   * @returns {string} returns the follow status
   * @memberof GetArticleStat
   */
  static async getFollow() {
    const res = await Follower.findOne({
      raw: true,
      where: { userId: authorId, followerId: userId },
      attributes: ['userId']
    });
    return res;
  }

  /**
   *Method To fetch bookmark status
   *
   * @static
   * @returns {string} returns the bookmark status
   * @memberof GetArticleStat
   */
  static async getBookmark() {
    const res = await Bookmark.findOne({
      raw: true,
      where: { userId, articleId },
      attributes: ['userId']
    });
    return res;
  }
}

export default GetArticleStat;
