'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserRole extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserRole.belongsTo(models.Role, 
        {
          foreignKey: {allowNull: false, name: 'role_id'}, 

        })
      
      UserRole.belongsTo(models.User, 
        {
          foreignKey: {allowNull: false, name: 'user_id'}, 

        })
      
    }
  }
  UserRole.init({
    user_role_id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING,
    },
  }, {
    sequelize,
    modelName: 'UserRole',
  });
  return UserRole;
};