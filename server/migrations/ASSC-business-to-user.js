'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Users', // name of Source model
      'biz_id',
       // name of the key we're adding 
      {
        type: Sequelize.UUID,
        references: {
          model: 'Businesses', // name of Target model
          key: 'biz_id', // key in Target model that we're referencing
        },
        allowNull: false,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'Users', // name of Source model
      'biz_id' // key we want to remove
    );
  }
};
