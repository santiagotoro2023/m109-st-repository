const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../../config/config.js')[env];
const db = {};
let dbConf = {}

// reset the automatic date conversion of pg and work with the timezones
var pg = require('pg');
pg.types.setTypeParser(1082, 'text', function(text) {return text;});
pg.types.setTypeParser(1184, 'text', function(text) {return text;});
pg.types.setTypeParser(1114, 'text', function(text) {return text;});

dbConf.port = config.port;
dbConf.dialect = config.dialect
dbConf.host = config.host
dbConf.timezone = 'Europe/Vienna'
dbConf.dialectOptions = {
  useUTC: false, //for reading from database
  dateStrings: true,
  typeCast: function (field, next) { // for reading from database
    if (field.type === 'DATETIME') {
      return field.string()
    }
      return next()
    },
}

let sequelize = new Sequelize(config.database, config.username, config.password, dbConf);

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;