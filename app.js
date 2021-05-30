
// DB_PORT=<DB-PORT>
// DB_NAME=<DB-NAME>
// DB_HOST=<DB-HOSTNAME>
// DB_USER=<DB-USER>
// DB_PASSWORD=<DB-PASSWORD>
// EMAIL_ADDRESS=<EMAIL-ADDRESS>          
// EMAIL_PASSWORD=<EMAIL-PASSWORD>
// AWS_ACCESS_KEY_ID=<AWS-ACCESS-KEY>
// AWS_SECRET_ACCESS_KEY=<AWS-SECRET-ACCESS-KEY>
// AWS_REGION=<AWS-REGION>
// IV=<INITILIZATION-VECTOR>
// CRYPT_PASSWORD=<CRYPT-PASSWORD>

require('dotenv').config();
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const logger = require('morgan');
var os = require("os");
var hostname = os.hostname();
const app = express();

const port = process.env.PORT || 4500


// Getting data in json format

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Setting up cors

var cors = require('cors');
var corsOption = {
  origin: "*",
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  exposedHeaders: ['x-auth-token']
};
app.use(cors(corsOption));

// Using Helmet

app.use(helmet())

// Logger

app.use(logger('common'))

//Setting swagger Documentation

const swaggerJSDoc = require('swagger-jsdoc');
const swaggerDefinition = {
  info: {
    title: 'Node-OTP-Service API',
    version: '1.0.0',
    description: 'Documentation for Node-Js OTP service API',
  },
  host: 'node-otp-service.herokuapp.com',
  basePath: '/api/v1/',
};
const options = {
  swaggerDefinition,
  apis: ['./routes/*.js','./models/OTP.js'],
  
};
const swaggerSpec = swaggerJSDoc(options);
app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.get('/docs', (req, res) => {
  res.sendFile(path.join(__dirname, 'redoc.html'));
});


//Importing Routes
const sendOTP_to_phone = require('./routes/sendOTP_to_phone');
const verify_otp = require('./routes/verifyOTP')
const sendOTP_to_email = require('./routes/sendOTP_to_email')


//Using imported Routes
app.use('/api/v1', sendOTP_to_phone);
app.use('/api/v1', verify_otp);
app.use('/api/v1/', sendOTP_to_email);




//==================================================================================================================================

app.get('/', function (req, res) {
  console.log('route / is accessed.');
  res.send('Hi');
});

app.listen(port, function () {
  console.log(`Server is running on port ${port}`);
});
