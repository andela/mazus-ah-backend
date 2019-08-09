/* eslint-disable no-unused-vars */
import faker from 'faker';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert(
    'Tags',
    [
      {
        id: faker.random.uuid(),
        articleId: 'ab8b9dd2-22bc-4dc2-b2dd-942a5dcb5437',
        name: 'Building APIs',
      },
      {
        id: faker.random.uuid(),
        articleId: 'ab8b9dd2-22bc-4dc2-b2dd-942a5dcb5437',
        name: 'Node js',
      },
    ],
    {},
  ),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Tags', null, {})

};
