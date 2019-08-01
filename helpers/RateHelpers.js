
import models from '../database/models';

const { Article, Rating } = models;

/**
 * @class RatingController
 * @exports RateHelpers
 */
class RateHelpers {
  /**
   *
   * @static
   *
   * @param {object} slug request object
   * @returns {object} returns article data
   *
   * @memberof RateHelpers
   */
  static fetchArticle(slug) {
    return Article.findOne({ where: { slug } });
  }

  /**
   *
   * @static
   *
   * @param {object} slug request object
   * @returns {object} returns article data
   *
   * @memberof RateHelpers
   */
  static checkAuthor(slug) {
    return Article.findOne({ where: { slug } });
  }

  /**
   *
   * @static
   *
   * @param {object} user request object
   * @param {integer} id request object
   * @returns {object} returns rating data
   *
   * @memberof RateHelpers
   */
  static checkRateData(user, id) {
    return Rating.findOne({ where: { userId: user, articleId: id } });
  }

  /**
   *
   * @static
   *
   * @param {object} rate request object
   * @param {integer} id request object
   * @param {object} user request object
   * @returns {object} returns rating data
   *
   * @memberof RateHelpers
   */
  static updateRating(rate, id, user) {
    return Rating.update({ rate }, { where: { articleId: id, userId: user } });
  }

  /**
   *
   * @static
   *
   * @param {object} rate request object
   * @returns {object} returns rating data
   *
   * @memberof RateHelpers
   */
  static createRating(rate) {
    return Rating.create(rate);
  }
}

export default RateHelpers;
