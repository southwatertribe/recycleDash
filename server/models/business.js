'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Business extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // this.hasMany(models.User)    
      // Business.hasMany(models.User)  
    }
  }
  Business.init({
    biz_id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING,
    },
    biz_name: DataTypes.STRING  
  }, {
    sequelize,
    modelName: 'Business',
  });
  return Business;
};