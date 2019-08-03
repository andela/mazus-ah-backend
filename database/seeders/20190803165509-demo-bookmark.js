/* eslint-disable arrow-body-style */
/* eslint-disable no-unused-vars */

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'Bookmarks',
      [
        {
          userId: 'ffe25dbe-29ea-4759-8461-ed116f6739dd',
          articleId: 'ab8b9dd2-22bc-4dc2-b2dd-942a5dcb5437'
        },
        {
          userId: '8c9589fb-5b25-4df9-92ee-2b20ba4f9407',
          articleId: 'ab8b9dd2-22bc-4dc2-b2dd-942a5dcb5437'
        },
        {
          userId: 'fdfe8617-208d-4b87-a000-5d6840786ab8',
          articleId: 'ab8b9dd2-22bc-4dc2-b2dd-942a5dcb5437'
        },
        {
          userId: '90356e2a-2f35-48e9-9add-9811c23f2122',
          articleId: 'ab8b9dd2-22bc-4dc2-b2dd-942a5dcb5437'
        },
        {
          userId: '90356e2a-2f35-48e9-9add-9811c23f2122',
          articleId: 'cf67650f-2b74-416e-9050-89f92f873ecb'
        }
      ]
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Bookmarks', null, {});
  }
};
