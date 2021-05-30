# Node-js-OTP Service

### About

It is an API that implements a OTP service in a scalable manner. In this, we do not need to store OTP with email or phone numbers rather a encrypted object is sent in response when OTP is requested which is decrypted and verified at the time of verification.

### Setup

- Download postgreSQL from https://www.postgresql.org/download/ .
- Setup postgres Database by using psql command line.
- Get the Database Credentials.
- Create a ```.env``` file in the project folder. 

```
PORT=<APPLICATION-PORT>
DB_PORT=<DB-PORT>
DB_NAME=<DB-NAME>
DB_HOST=<DB-HOSTNAME>
DB_USER=<DB-USER>
DB_PASSWORD=<DB-PASSWORD>
EMAIL_ADDRESS=<EMAIL-ADDRESS>          
EMAIL_PASSWORD=<EMAIL-PASSWORD>
AWS_ACCESS_KEY_ID=<AWS-ACCESS-KEY>
AWS_SECRET_ACCESS_KEY=<AWS-SECRET-ACCESS-KEY>
AWS_REGION=<AWS-REGION>
IV=<INITILIZATION-VECTOR>
CRYPT_PASSWORD=<CRYPT-PASSWORD>
```
  > Note : You have set a valid value for IV. Like:
  ```
  IV=28408e46
  ```
- Use ` npm install` to install all the dependency for the project.
- Database will be automatically migrated when the application starts.
- Use ` npm start` to start the application.

## Usage

#### To Send OTP to Emails

- `/api/v1/email/otp` 
  - _Allowed Methods_ : `POST`
  - `Description`: In this endpoint, we will take the email and type of the service request from any service using this OTP service and send the status and encrypted details in the response.
  - Request Object :
     ```json
    {
        "email":"<email-address>",
        "type":"<type>"
    }
    ```
    > Note: Type can have 3 values that are : VERIFICATION, FORGET, 2FA. This is used to choose message template for email. 

  - Response :
    - Status Code:
      - 200: 
        ```json
        {
            "Status": "Success",
            "Details": "<Verification-Token"
        }
        ```
      - 400:
          ```json
            {
                "Status": "Failure",
                "Details": "<Error Message"
            }
           ```
      
#### To Send OTP to Phone Numbers

- `/api/v1/phone/otp` 
  - _Allowed Methods_ : `POST`
  - `Description`: In this endpoint, we will take the phone number and type of the service request from any service using this OTP service and send the status and encrypted details in the response.
  - Request Object :
     ```json
    {
        "phone_number":"<phone_number>",
        "type":"<type>"
    }
    ```
    > Note: Type can have 3 values that are : VERIFICATION, FORGET, 2FA. This is used to choose message template for email. 

  - Response :
    - Status Code:
      - 200: 
        ```json
        {
            "Status": "Success",
            "Details": "<Verification-Token"
        }
        ```
      - 400:
          ```json
            {
                "Status": "Failure",
                "Details": "<Error Message"
            }
           ```
          
 #### To Verify OTP

- `/api/v1/verify/otp` 
  - _Allowed Methods_ : `POST`
  - `Description`: In this endpoint, we will get three values in the request that is OTP, verification key and a check value having either email or number. After this the client will receive Success if OTP Matches otherwise Bad Request.
  - Request Object :
     ```json
    {
      "otp": "<OTP>",
      "verification_key": "<Verification-Token>",
      "check": "<Email or Phone Number>"
    }
    ```
    > Note: Type can have 3 values that are : VERIFICATION, FORGET, 2FA. This is used to choose message template for email. 

  - Response :
    - Status Code:
      - 200: 
        ```json
        {
            "Status": "Success",
            "Details": "OTP Matched",
            "Check": "<Email or Phone Number>"
        }
        ```
      - 400:
          ```json
            {
                "Status": "Failure",
                "Details": "<Error Message"
            }
           ```