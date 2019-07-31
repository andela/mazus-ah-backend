/* eslint-disable no-unused-vars */
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert(
    'BlacklistedTokens',
    [
      {
        id: 'b9f8a8d7-acc6-4f3a-bc45-056257b96418',
        token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZmlyc3ROYW1lIjoiSm9obiIsImlhdCI6MTU2NDAwOTA5NCwiZXhwIjoxNTY0MDEyNjk0fQ.J5ktoXlmLxOtV8R16sNPMXXeydwRdCA8h6Cep-AzZnc',
        userId: 'ffe25dbe-29ea-4759-8461-ed116f6739dd',
      },
    ],
    {},
  ),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Users', null, {}),
};
