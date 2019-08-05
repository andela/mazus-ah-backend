/* eslint-disable arrow-body-style */
/* eslint-disable no-unused-vars */
import faker from 'faker';
import Helper from '../../helpers/Auth';

const password = Helper.hashPassword('passwordHash');

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
          isVerified: true,
          password: `${password}`,
        },
        {
          id: '8c9589fb-5b25-4df9-92ee-2b20ba4f9407',
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'janedoe@test.com',
          isVerified: true,
          password: `${password}`,
        },
        {
          id: 'fdfe8617-208d-4b87-a000-5d6840786ab8',
          firstName: 'Mike',
          lastName: 'Mike',
          email: 'mikemike@test.com',
          isVerified: false,
          password: `${password}`,
        },
        {
          id: '90356e2a-2f35-48e9-9add-9811c23f2122',
          firstName: 'David',
          lastName: 'Noah',
          email: 'davidnoah@test.com',
          isVerified: false,
          password: `${password}`,
        },
        {
          id: '588ae2cd-de3f-404a-87b3-8a6d50864833',
          firstName: 'Pelumi',
          lastName: 'Noah',
          email: 'pelumi@test.com',
          password: Helper.hashPassword('PasswoRD123__'),
          isVerified: true,
        },
        {
          id: '356304da-50bc-4488-9c85-88874a9efb16',
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          email: faker.internet.email(),
          password: Helper.hashPassword('PasswoRD123__'),
          isVerified: true,
        },
        {
          id: '51d509cc-b787-4abf-b176-fdb63cb9ed44',
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          email: faker.internet.email(),
          password: Helper.hashPassword('PasswoRD123__'),
          isVerified: true,
        },
        {
          id: '1810e81d-9e5c-4a50-97e2-410fa230e166',
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          email: faker.internet.email(),
          password: Helper.hashPassword('PasswoRD123__'),
          isVerified: true,
        },
        {
          id: 'c3ee24b4-46ea-4b96-bad9-a114a8baf7a8',
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          email: faker.internet.email(),
          password: Helper.hashPassword('PasswoRD123__'),
          isVerified: true,
        },
        {
          id: 'a3868c24-6648-434c-8085-cf16ceb8915c',
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          email: faker.internet.email(),
          password: Helper.hashPassword('PasswoRD123__'),
          isVerified: true,
        },
        {
          id: 'cf4aa1aa-7996-400e-a92d-b0ee07c91277',
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          email: faker.internet.email(),
          password: Helper.hashPassword('PasswoRD123__'),

        },
        {
          id: '24000aa6-8bb4-48a5-b65a-3ab8e91ddbed',
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          email: faker.internet.email(),
          password: Helper.hashPassword('PasswoRD123__'),

        },
        {
          id: 'dfd40601-af8a-4250-bb7c-1f01bb2de6d5',
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          email: faker.internet.email(),
          password: Helper.hashPassword('PasswoRD123__'),

        },
        {
          id: 'b604652c-4332-4633-9217-a1d921024b6a',
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          email: faker.internet.email(),
          password: Helper.hashPassword('PasswoRD123__'),

        },
        {
          id: '7c7a6097-2626-4136-b719-43f65977e021',
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          email: faker.internet.email(),
          password: Helper.hashPassword('PasswoRD123__'),
          isVerified: true,
        },
        {
          id: '32fd7e50-b687-447f-af7c-c209b8f98765',
          firstName: 'Dave',
          lastName: 'Davies',
          email: 'dd@test.com',
          password: Helper.hashPassword('PasswoRD123__'),
          isVerified: true,
        },
        {
          id: '0ec73114-c834-4dc9-838d-089083680763',
          firstName: 'Tunji',
          lastName: 'Noah',
          email: 'tunji@test.com',
          password: Helper.hashPassword('PasswoRD123__'),
          isVerified: false,
        },
      ],
      {},
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
