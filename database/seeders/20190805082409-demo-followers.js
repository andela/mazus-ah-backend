/* eslint-disable strict */
/* eslint-disable no-unused-vars */

'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert(
    'Followers',
    [
      {
        id: 'ffe25dbe-29ea-4759-8461-ed116f6739de',
        followerId: 'ffe25dbe-29ea-4759-8461-ed116f6739dd',
        userId: 'fdfe8617-208d-4b87-a000-5d6840786ab8',
      },
    ],
    {},
  ),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Followers', null, {})
};
