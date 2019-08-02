/* eslint-disable arrow-body-style */
/* eslint-disable no-unused-vars */
import uuidV4 from 'uuid/v4';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'Ratings',
      [
        {
          id: uuidV4(),
          rate: 1,
          userId: '7c7a6097-2626-4136-b719-43f65977e021',
          articleId: 'ab8b9dc1-22bc-4dc2-b2dd-942a5dcbf03b',
        },
        {
          id: uuidV4(),
          rate: 5,
          userId: 'b604652c-4332-4633-9217-a1d921024b6a',
          articleId: '3eab3b9c-9782-4cc8-95c4-31c3fe5df09e',
        },
        {
          id: uuidV4(),
          rate: 5,
          userId: 'dfd40601-af8a-4250-bb7c-1f01bb2de6d5',
          articleId: '3eab3b9c-9782-4cc8-95c4-31c3fe5df09e',
        },
        {
          id: uuidV4(),
          rate: 5,
          userId: '24000aa6-8bb4-48a5-b65a-3ab8e91ddbed',
          articleId: '3eab3b9c-9782-4cc8-95c4-31c3fe5df09e',
        },
        {
          id: uuidV4(),
          rate: 2,
          userId: 'cf4aa1aa-7996-400e-a92d-b0ee07c91277',
          articleId: '3eab3b9c-9782-4cc8-95c4-31c3fe5df09e',
        },
        {
          id: uuidV4(),
          rate: 1,
          userId: 'c3ee24b4-46ea-4b96-bad9-a114a8baf7a8',
          articleId: 'ab8b9dc1-22bc-4dc2-b2dd-942a5dcbf03b',
        },
        {
          id: uuidV4(),
          rate: 5,
          userId: 'fdfe8617-208d-4b87-a000-5d6840786ab8',
          articleId: 'cf67650f-2b74-416e-9050-89f92f147ecb',
        },
        {
          id: uuidV4(),
          rate: 5,
          userId: '51d509cc-b787-4abf-b176-fdb63cb9ed44',
          articleId: '3eab3b9c-9782-4cc8-95c4-31c3fe5df09e',
        },
        {
          id: uuidV4(),
          rate: 5,
          userId: '356304da-50bc-4488-9c85-88874a9efb16',
          articleId: '3eab3b9c-9782-4cc8-95c4-31c3fe5df09e',
        },
        {
          id: uuidV4(),
          rate: 2,
          userId: '588ae2cd-de3f-404a-87b3-8a6d50864833',
          articleId: '3eab3b9c-9782-4cc8-95c4-31c3fe5df09e',
        },
        {
          id: uuidV4(),
          rate: 1,
          userId: '90356e2a-2f35-48e9-9add-9811c23f2122',
          articleId: 'ab8b9dc1-22bc-4dc2-b2dd-942a5dcbf03b',
        },
        {
          id: uuidV4(),
          rate: 5,
          userId: 'fdfe8617-208d-4b87-a000-5d6840786ab8',
          articleId: '3eab3b9c-9782-4cc8-95c4-31c3fe5df09e',
        },
        {
          id: uuidV4(),
          rate: 5,
          userId: '8c9589fb-5b25-4df9-92ee-2b20ba4f9407',
          articleId: '3eab3b9c-9782-4cc8-95c4-31c3fe5df09e',
        },
        {
          id: uuidV4(),
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
