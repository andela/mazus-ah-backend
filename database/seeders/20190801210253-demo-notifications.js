/* eslint-disable arrow-body-style */
/* eslint-disable no-unused-vars */

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'Notifications',
      [
        {
          id: 'ffe45dbe-29ea-4759-8461-ed116f6739dd',
          read: false,
          receiverId: '8c9589fb-5b25-4df9-92ee-2b20ba4f9407',
          type: 'comment',
          payload: JSON.stringify({
            commentBy: 'Pelumi',
            articleTitle: 'Importance of frog',
            slug: 'importance-of-frog-123322323'
          }),
        },
        {
          id: 'ffe45dbe-59ea-4759-8461-ed116f6739dd',
          read: false,
          receiverId: 'ffe25dbe-29ea-4759-8461-ed116f6739dd',
          type: 'comment',
          payload: JSON.stringify({
            commentBy: 'DFay MAy',
            articleTitle: 'Fay of May',
            slug: 'fay-of-music-234423'
          }),
        },
        {
          id: 'ffe45dbe-39ea-4759-8461-ed116f6739dd',
          read: false,
          receiverId: 'fdfe8617-208d-4b87-a000-5d6840786ab8',
          type: 'follower',
          payload: JSON.stringify({
            follower: 'Pelumi Alesh',
            avatarUrl: 'gooflgmen.cloudinary.com'
          }),
        },
        {
          id: 'ffe45dbe-29ea-4909-8461-ed116f6739dd',
          read: false,
          receiverId: '8c9589fb-5b25-4df9-92ee-2b20ba4f9407',
          type: 'follower',
          payload: JSON.stringify({
            follower: 'SanJosé',
            avatarUrl: 'goofgmen.cloudinary.com'
          }),
        }
      ],
      {},
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Notifications', null, {});
  }
};
