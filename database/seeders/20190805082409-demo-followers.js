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
      {
        id: 'e89695aa-1f7e-468c-89dd-5fc2332e31f8',
        followerId: '6675f038-8c66-4485-9dcf-4660ac27ccd1',
        userId: 'e89695aa-1f7e-468c-89dd-5fc2332e31f1',
      },
      {
        id: 'e89695aa-1f7e-468c-89dd-5fc2332e31f9',
        followerId: 'e509854f-80df-413f-809f-66b5968d03ae',
        userId: 'e89695aa-1f7e-468c-89dd-5fc2332e31f1',
      }
    ],
    {},
  ),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Followers', null, {})
};
