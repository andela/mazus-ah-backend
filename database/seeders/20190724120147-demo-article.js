/* eslint-disable arrow-body-style */
/* eslint-disable no-unused-vars */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'Articles',
      [

        {
          id: 'ab8b9dd2-22bc-4dc2-b2dd-942a5dcb5437',
          title: 'Building APIs with Nodejs',
          slug: 'building-apis-with-nodejs-48458493',
          body: 'Welcome to building apis with nodejs, this is a beginner friendly tutorial...',
          description: 'A nodejs tutorial',
          status: 'published',
          userId: 'fdfe8617-208d-4b87-a000-5d6840786ab8',
          readTime: 10,
        },
        {
          id: 'ab8b9dc1-22bc-4dc2-b2dd-942a5dcbf03b',
          title: 'Some title',
          slug: 'some-slug',
          body: 'the body the article goes here',
          description: 'article description here',
          status: 'published',
          userId: 'fdfe8617-208d-4b87-a000-5d6840786ab8',
          readTime: 5,
        },
        {
          id: '3eab3b9c-9782-4cc8-95c4-31c3fe5df09e',
          title: '3 Bad Guys',
          slug: '3-bad-guys',
          body: 'Once upon a time, some 3 bad guys entered...',
          status: 'published',
          description: 'something about some bad guys sha',
          userId: 'ffe25dbe-29ea-4759-8461-ed116f6739dd',
          readTime: 3,
        },
        {
          id: 'cf67650f-2b74-416e-9050-89f92f873ecb',
          title: 'Article title',
          slug: 'draft-article-slug',
          body: 'the body the article goes here',
          status: 'draft',
          description: 'article description here',
          userId: 'fdfe8617-208d-4b87-a000-5d6840786ab8',
          readTime: 5,
        },
        {
          id: 'cf67650f-2b74-416e-9050-89f92f147ecb',
          title: 'Article title',
          slug: 'article-slug',
          body: 'the body the article goes here',
          status: 'draft',
          description: 'article description here',
          userId: 'ffe25dbe-29ea-4759-8461-ed116f6739dd',
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
