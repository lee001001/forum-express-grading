'use strict'

const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Comments',
      Array.from({ length: 100 }).map((d, i) =>
        ({
          id: i + 1,
          text: faker.lorem.text().substring(0, 50),
          UserId: Math.floor(Math.random() * 2) * 10 + 1,
          RestaurantId: Math.floor(Math.random() * 51) * 10 + 1,
          createdAt: new Date(),
          updatedAt: new Date()
        }))
      , {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Comments', null, {})
  }
}
