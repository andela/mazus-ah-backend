/* eslint-disable arrow-body-style */
/* eslint-disable no-unused-vars */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'Comments',
      [
        {
          id: '1536b14b-0669-42aa-a0a9-cae685aecc74',
          body: 'some comment by user1 on article 1',
          userId: 'ffe25dbe-29ea-4759-8461-ed116f6739dd',
          articleId: 'ab8b9dc1-22bc-4dc2-b2dd-942a5dcbf03b',
        },
        {
          id: '25a04c3d-04dc-485f-b41e-ae640fe629d4',
          body: 'I love this article about the three guys',
          userId: 'fdfe8617-208d-4b87-a000-5d6840786ab8',
          articleId: '3eab3b9c-9782-4cc8-95c4-31c3fe5df09e',
        },
        {
          id: '35dc7202-c52a-4762-8637-6a92f6492c02',
          body: 'this article is quite interesting',
          userId: 'ffe25dbe-29ea-4759-8461-ed116f6739dd',
          articleId: '3eab3b9c-9782-4cc8-95c4-31c3fe5df09e',
        },
        {
          id: '6675f038-8c66-4485-9dcf-4660ac27ccd9',
          body: 'Nice one',
          userId: '6675f038-8c66-4485-9dcf-4660ac27ccd1',
          articleId: 'a2cda7e8-28ba-4507-9563-3e4ea280efb6',
        },
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> feature(admin):admin can delete article and comment
        {
          id: '6675f038-8c66-4485-9dcf-4660ac27ccd5',
          body: 'Nice one',
          userId: '6675f038-8c66-4485-9dcf-4660ac27ccd1',
          articleId: 'a2cda7e8-28ba-4507-9563-3e4ea280efb6',
        },
        {
          id: '6675f038-8c66-4485-9dcf-4660ac27ccd0',
          body: 'Nice one',
          userId: '6675f038-8c66-4485-9dcf-4660ac27ccd1',
          articleId: 'a2cda7e8-28ba-4507-9563-3e4ea280efb6',
        },
<<<<<<< HEAD
=======
>>>>>>> feature(comment) user can edit comment
=======
>>>>>>> feature(admin):admin can delete article and comment
      ],
      {},
    );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Comments', null, {});
  }
};
