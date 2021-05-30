/* eslint-disable indent */

/**
 * @swagger
 * definitions:
 *   Details:
 *     type: object
 *     properties:
 *       Status:
 *         type: string
 *       Details:
 *         type: string
 */

/**
 * @swagger
 * definitions:
 *   VerificationDetails:
 *     type: object
 *     properties:
 *       Status:
 *         type: string
 *       Details:
 *         type: string
 *       Check:
 *         type: string
 */

/**
 * @swagger
 * definitions:
 *   OTP:
 *     type: object
 *     properties:
 *       id:
 *         type: uuid
 *       first_name:
 *         type: string
 *       last_name:
 *         type: string
 *       email:
 *         type: string
 *       username:
 *         type: string
 *       password:
 *         type: string
 *         format: password
 *       resetPasswordToken:
 *         type: string
 *       resetPasswordExpires:
 *         type: string
 *         format: date-time
 *       required:
 *         - email
 *         - username
 *         - password
 */

module.exports = function(sequelize, DataTypes) {
  // return queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";').then(()=>{
	return sequelize.define('OTP', {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      otp: DataTypes.STRING,
      expiration_time: DataTypes.DATE,
      verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: true
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.fn('now')
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.fn('now')
      }     
    }, {
		tableName: 'OTP'
  });
//  });
};

