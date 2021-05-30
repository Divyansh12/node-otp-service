const Sequelize = require('sequelize');
const OTP_Model = require('./models/OTP');

const sequelize = new Sequelize(process.env['DB_NAME'], process.env['DB_USER'], process.env['DB_PASSWORD'], {
  host: process.env['DB_HOST'],
  dialect:  'postgres',
  protocol: 'postgres',
  port:     process.env['DB_PORT'],
  dialectOptions: {
    "ssl": {
      "require":true,
      "rejectUnauthorized": false
    }
  },
  define: {
    timestamps: false
  },

  pool: {
      max: 20,
      min: 0,
      idle: 5000
  },
  logging:false
});

const OTP = OTP_Model(sequelize, Sequelize);

sequelize.sync().then(() => {
  console.log('db and tables have been created');
});

module.exports = {OTP};