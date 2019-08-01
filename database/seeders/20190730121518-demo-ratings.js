/* eslint-disable arrow-body-style */
/* eslint-disable no-unused-vars */

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'Ratings',
      [
        {
          id: '1536b14b-0669-42aa-a0a9-cae685aecc74',
          rate: 1,
          userId: 'ffe25dbe-29ea-4759-8461-ed116f6739dd',
          articleId: 'ab8b9dc1-22bc-4dc2-b2dd-942a5dcbf03b',
        },
        {
          id: '90356e2a-2f35-48e9-9add-9811c23f2122',
          rate: 5,
          userId: 'fdfe8617-208d-4b87-a000-5d6840786ab8',
          articleId: '3eab3b9c-9782-4cc8-95c4-31c3fe5df09e',
        },
        {
          id: 'fdfe8617-208d-4b87-a000-5d6840786ab8',
          rate: 5,
          userId: 'fdfe8617-208d-4b87-a000-5d6840786ab8',
          articleId: '3eab3b9c-9782-4cc8-95c4-31c3fe5df09e',
        },
        {
          id: '8c9589fb-5b25-4df9-92ee-2b20ba4f9407',
          rate: 5,
          userId: 'fdfe8617-208d-4b87-a000-5d6840786ab8',
          articleId: '3eab3b9c-9782-4cc8-95c4-31c3fe5df09e',
        },
        {
          id: '35dc7202-c52a-4762-8637-6a92f6492c02',
          rate: 2,
          userId: 'ffe25dbe-29ea-4759-8461-ed116f6739dd',
          articleId: '3eab3b9c-9782-4cc8-95c4-31c3fe5df09e',
        },
      ],
      {},
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Ratings', null, {});
  }
};
