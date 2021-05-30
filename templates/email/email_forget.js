const subject_mail = "OTP: For Reset Password"



const message = (otp) =>{
    return `Dear User, \n\n` 
    + 'OTP for Reset Password is : \n\n'
    + `${otp}\n\n`
    + 'This is a auto-generated email. Please do not reply to this email.\n\n'
    + 'Regards\n'
    + 'Divyansh Agarwals\n\n'
}

module.exports = {subject_mail, message};