'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'UserRoles', // name of Source model
      'user_id', // name of the key we're adding 
      {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users', // name of Target model
          key: 'user_id', // key in Target model that we're referencing
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      }
    );
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.removeColumn(
      'UserRoles', // name of Source model
      'user_id' // key we want to remove
    );
  }
};
