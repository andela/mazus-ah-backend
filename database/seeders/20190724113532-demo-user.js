/* eslint-disable arrow-body-style */
/* eslint-disable no-unused-vars */

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'Users',
      [
        {
          firstName: 'John',
          lastName: 'Doe',
          email: 'johndoe@test.com',
          password: 'passwordHash',
        },
        {
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'janedoe@test.com',
          password: 'passwordHash',
        },
        {
          firstName: 'Mike',
          lastName: 'Mike',
          email: 'mikemike@test.com',
          password: 'passwordHash',
        },
        {
          firstName: 'David',
          lastName: 'Noah',
          email: 'davidnoah@test.com',
          password: 'passwordHash',
        },
      ],
      {},
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
