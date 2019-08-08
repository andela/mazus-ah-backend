import Debug from 'debug';
import dotenv from 'dotenv';
import Postals from './Postals';

const debug = Debug('dev');
const url = process.env.FRONTEND_URL;

dotenv.config();
/**
 *
 *
 * @export
 * @class EmailVerification
 */
export default class ShareArticle {
  /**
   *
   * @static
   * @param {string} requestInfo - request information
   * @param {string} recipient - recipient of the email
   * @param {string} title - title of the article
   * @param {string} slug - article slug
   * @memberof ShareArticleByMail
   * @returns {function} - returns a function call
   */
  static shareArticleByMail(requestInfo, recipient, title, slug) {
    const { firstName, lastName } = requestInfo.user;


    const message = `<p>  
                    ${firstName} ${lastName} shared this article <b>${title}</b> from Author's Haven with you,
                  </p>
                  <p>
                  Click <a href= ${url}/${slug}> ${title}</a> to view
                  </p>`;
    Postals.sendEmail(
      recipient,
      'mazus.ah@gmail.com',
      `${firstName} ${lastName} shared an article with you`,
      message
    );
  }


  /**
   *
   * @static
   * @param {string} requestInfo - request information
   * @param {string} slug - article slug
   * @memberof ShareArticle
   * @returns {function} - returns a function call
   */
  static shareArticleByTwitter(requestInfo, slug) {
    const shareLink = `https://twitter.com/intent/tweet?url=${url}/${slug}`;
    debug(shareLink);
    return shareLink;
  }

  /**
   *
   * @static
   * @param {string} requestInfo - request information
   * @param {string} slug - article slug
   * @memberof ShareArticle
   * @returns {function} - returns a function call
   */
  static shareArticleByFacebook(requestInfo, slug) {
    const shareLink = `http://www.facebook.com/sharer.php?href=${url}/${slug}`;
    debug(shareLink);
    return shareLink;
  }
}
