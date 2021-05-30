/* eslint-disable no-console */
const {OTP} = require('../sequelize');
const router = require("express").Router();
const {encode} = require("../middlewares/crypt")
// var otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer')

/**
 * @swagger
 * /email/otp:
 *   post:
 *     tags:
 *       - OTP
 *     name: Send OTP to Email
 *     summary: Send OTP to Email
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *             type:
 *               type: string
 *         required:
 *           - email
 *           - type
 *     responses:
 *       '200':
 *         description: OTP sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Details'
 *               type: object
 *               properties:
 *                Status:
 *                  type: string
 *                Details:
 *                  type: string
 *       '400':
 *         description: Either Email is not provided or Type is not provided
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Details'
 *               type: object
 *               properties:
 *                Status:
 *                  type: string
 *                Details:
 *                  type: string
 * 
 *       
 */

// To add minutes to the current time
function AddMinutesToDate(date, minutes) {
  return new Date(date.getTime() + minutes*60000);
}


router.post('/email/otp', async (req, res, next) => {
  try{
    const {email,type} = req.body;
    let email_subject, email_message
    if(!email){
      const response={"Status":"Failure","Details":"Email not provided"}
      return res.status(400).send(response) 
    }
    if(!type){
      const response={"Status":"Failure","Details":"Type not provided"}
      return res.status(400).send(response) 
    }

    //Generate OTP 
    const otp = otpGenerator.generate(6, { alphabets: false, upperCase: false, specialChars: false });
    const now = new Date();
    const expiration_time = AddMinutesToDate(now,10);
    
  
  //Create OTP instance in DB
    const otp_instance = await OTP.create({
      otp: otp,
      expiration_time: expiration_time
    });

    // Create details object containing the email and otp id
    var details={
      "timestamp": now, 
      "check": email,
      "success": true,
      "message":"OTP sent to user",
      "otp_id": otp_instance.id
    }

    // Encrypt the details object
    const encoded= await encode(JSON.stringify(details))
    
    //Choose message template according type requestedconst encoded= await encode(JSON.stringify(details))
    if(type){
      if(type=="VERIFICATION"){
        const {message, subject_mail} = require('../templates/email/email_verification');
        email_message=message(otp)
        email_subject=subject_mail
      }
      else if(type=="FORGET"){
        const {message, subject_mail} = require('../templates/email/email_forget');
        email_message=message(otp)
        email_subject=subject_mail
      }
      else if(type=="2FA"){
        const {message, subject_mail} = require('../templates/email/email_2FA');
        email_message=message(otp)
        email_subject=subject_mail
      }
      else{
        const response={"Status":"Failure","Details":"Incorrect Type Provided"}
        return res.status(400).send(response) 
      }
    }

    // Create nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.zoho.in',
      port: 465,
      secure: true,
      auth: {
        user: `${process.env.EMAIL_ADDRESS}`,
        pass: `${process.env.EMAIL_PASSWORD}`
      },
    });


    const mailOptions = {
      from: `"Divyansh Agarwal"<${process.env.EMAIL_ADDRESS}>`,
      to: `${email}`,
      subject: email_subject,
      text: email_message ,
    };

    await transporter.verify();
    
    //Send Email
    await transporter.sendMail(mailOptions, (err, response) => {
      if (err) {
          return res.status(400).send({"Status":"Failure","Details": err });
      } else {
        // console.log('here is the res: ', response);
        return res.send({"Status":"Success","Details":encoded});
      }
    });
  }
  catch(err){
    const response={"Status":"Failure","Details": err.message}
    return res.status(400).send(response)
  }
});

 
module.exports = router;
