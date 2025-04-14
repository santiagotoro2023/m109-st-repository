'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Measurement extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Measurement.belongsTo(models.UseCase, {
        foreignKey: 'id'
      })
    }
  }
  Measurement.init({
    groupName: DataTypes.STRING,
    value: DataTypes.STRING,
    timestamp: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'Measurement',
  });

  return Measurement;
};