const nodemailer = require("nodemailer")
const dotenv = require("dotenv")
dotenv.config()

const sendMail = async (to, subject, text) => {
  let transport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user:process.env.WEB_EMAIL,
      pass:process.env.PASS
    }
  })

  let info = await transport.sendMail({
    from:process.env.WEB_EMAIL,
    to,
    subject,
    text
  })

  
  console.log("Message Send : %s", info.messageId)
  console.log(info)
}

module.exports = sendMail