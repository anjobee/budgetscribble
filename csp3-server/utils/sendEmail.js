import nodemailer from 'nodemailer'
import asyncHandler from 'express-async-handler'

const sendEmail = asyncHandler(async (options) => {
  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
      type: 'OAuth2',
      user: process.env.SMTP_EMAIL,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      refreshToken: process.env.GOOGLE_CLIENT_REFRESH_TOKEN
    }
  })

  const message = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message
  }

  const info = await transporter.sendMail(message)

  console.log('Message sent: %s', info.messageId)
})

export { sendEmail }
