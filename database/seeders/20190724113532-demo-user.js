/* eslint-disable arrow-body-style */
/* eslint-disable no-unused-vars */
import Helper from '../../helpers/Auth';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'Users',
      [
        {
          id: 'ffe25dbe-29ea-4759-8461-ed116f6739dd',
          firstName: 'John',
          lastName: 'Doe',
          email: 'johndoe@test.com',
          password: 'passwordHash',
        },
        {
          id: '8c9589fb-5b25-4df9-92ee-2b20ba4f9407',
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'janedoe@test.com',
          password: 'passwordHash',
        },
        {
          id: 'fdfe8617-208d-4b87-a000-5d6840786ab8',
          firstName: 'Mike',
          lastName: 'Mike',
          email: 'mikemike@test.com',
          password: 'passwordHash',
        },
        {
          id: '90356e2a-2f35-48e9-9add-9811c23f2122',
          firstName: 'David',
          lastName: 'Noah',
          email: 'davidnoah@test.com',
          password: 'passwordHash',
        },
        {
          id: '32fd7e50-b687-447f-af7c-c209b8f90041',
          firstName: 'Pelumi',
          lastName: 'Noah',
          email: 'pelumi@test.com',
          password: Helper.hashPassword('PasswoRD123__'),
          isVerified: true,
        },
      ],
      {},
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
