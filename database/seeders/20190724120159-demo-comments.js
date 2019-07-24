/* eslint-disable arrow-body-style */
/* eslint-disable no-unused-vars */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'Comments',
      [
        {
          body: 'some comment by user1 on article 1',
          userId: 1,
          articleId: 1,
        },
        {
          body: 'some comment by user3 on article 2',
          userId: 3,
          articleId: 2,
        },
        {
          body: 'some comment by user1 on article 2',
          userId: 1,
          articleId: 2,
        },
      ],
      {},
    );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Comments', null, {});
  }
};
