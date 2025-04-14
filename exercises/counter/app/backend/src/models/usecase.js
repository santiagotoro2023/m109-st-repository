'use strict';
const {
  Model
} = require('sequelize');

const bcrypt = require('bcrypt')

module.exports = (sequelize, DataTypes) => {
  class UseCase extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UseCase.hasMany(models.Measurement, {
        foreignKey: 'useCaseId'
      })
    }
  }
  UseCase.init({
    name: DataTypes.STRING,
    measurementOptions: DataTypes.JSON,
    pinCode: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'UseCase',
  });

  // static class function to convert frontend numerical pin to hash
  UseCase.generateHash = function(pinCode) {
    return bcrypt.hashSync(pinCode, 10)
  }

  // instance method to verify a numerical pin to the original hash
  UseCase.prototype.validPinCode = function(pinCode) {
    return bcrypt.compareSync(pinCode, this.pinCode);
  }

  return UseCase;
};