'use strict';

const db = require('../models/index')

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('UseCases', [{
      name: 'Test Use Case',
      measurementOptions: JSON.stringify([{
        id: 0,
        name: 'Test Measurement Option A',
        options: [{
          id: 0,
          name: 'Test Measurement Option 1',
          icon: 'arrow_back',
          value: 1
        }, {
          id: 1,
          name: 'Test Measurement Option 2',
          icon: 'arrow_forward',
          value: 2
        }]
      },
      {
        id: 1,

        name: 'Test Measurement Option B',
        options: [{
          id: 0,
          name: 'Test Measurement Option 1',
          icon: 'arrow_back',
          value: 1
        }, {
          id: 1,
          name: 'Test Measurement Option 2',
          icon: 'arrow_forward',
          value: 2
        }]
      }]),
      pinCode: db.UseCase.generateHash('1234'),
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      name: 'Test Use Case 2',
      measurementOptions: JSON.stringify([{
        id: 0,
        name: 'Test Measurement Option A',
        options: [{
          id: 0,
          name: 'Test Measurement Option 1',
          icon: 'arrow_back',
          value: 1
        }, {
          id: 1,
          name: 'Test Measurement Option 2',
          icon: 'arrow_forward',
          value: 2
        }]
      },
      {
        id: 1,

        name: 'Test Measurement Option B',
        options: [{
          id: 0,
          name: 'Test Measurement Option 1',
          icon: 'arrow_back',
          value: 1
        }, {
          id: 1,
          name: 'Test Measurement Option 2',
          icon: 'arrow_forward',
          value: 2
        }]
      }]),
      pinCode: db.UseCase.generateHash('1234'),
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  async down(queryInterface, Sequelize) {
    queryInterface.bulkDelete('UseCases', null, {});
  }
};
