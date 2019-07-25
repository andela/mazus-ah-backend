/* eslint-disable arrow-body-style */
/* eslint-disable no-unused-vars */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'Articles',
      [
        {
          title: 'Some title',
          slug: 'some-slug',
          body: 'the body the article goes here',
          description: 'article description here',
          userId: 3,
          readTime: 5,
        },
        {
          title: '3 Bad Guys',
          slug: '3-bad-guys',
          body: 'Once upon a time, some 3 bad guys entered...',
          description: 'something about some bad guys sha',
          userId: 1,
          readTime: 3,
        },
        {
          title: 'Article title',
          slug: 'article-slug',
          body: 'the body the article goes here',
          description: 'article description here',
          userId: 1,
          readTime: 5,
        },
      ],
      {},
    );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Articles', null, {});
  }
};
