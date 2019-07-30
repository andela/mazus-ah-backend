
/**
 *
 * @description class to model helper methods for articles
 * @export
 * @class ArticleHelper
 */
export default class ArticleHelper {
  /**
   * @method generateSlug
   * @description generates a slug for an article when given the title;
   * @static
   * @param {*} title
   * @returns {string} slug generatd with a random number
   * @memberof ArticleHelper
   */
  static generateSlug(title) {
    const formattedTitle = title.split(' ').join('-');
    const randomNumber = Math.floor(Math.random() * 100000);
    const slug = `${formattedTitle.toLowerCase()}-${randomNumber}`;
    return slug;
  }

  /**
   * @method getReadTime
   * @description Calculate how many minutes it takes to read a block of text
   * @static
   * @param {string} text
   * @returns {number} amount of minutes it takes to read a block of text
   * @memberof ArticleHelper
   */
  static getReadTime(text) {
    const articleLength = text.split(' ').length;
    const time = articleLength / 200;
    const readTime = Math.round(time);
    return readTime;
  }
}
