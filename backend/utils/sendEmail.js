const nodeMailer= require('nodemailer')
const sendEmail=async(options)=>{

    console.log(process.env.SMPT_PASS)
    const transpoter= nodeMailer.createTransport({
        host:process.env.SMPT_HOST,
        port:process.env.SMPT_PORT,
        service:process.env.SMPT_SERVICE,
        auth:{
            user:process.env.SMPT_MAIL,
            pass:process.env.SMPT_PASS
        }
    })
    const mailOptions={
        from:process.env.SMPT_MAIL,
        to:options.email,
        subject:options.subject,
        html:options.message

    }
    await transpoter.sendMail(mailOptions)
}


module.exports=sendEmail