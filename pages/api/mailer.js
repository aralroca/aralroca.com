import nodemailer from 'nodemailer';
import mandrillTransport from 'nodemailer-mandrill-transport'

export default (req, res) => {
  if (req.method !== 'POST' || !req.headers['api-key'] || !req.body) {
    res.redirect(301, '/')
    return
  }

  const smtpTransport = nodemailer.createTransport(mandrillTransport({
    auth: {
      apiKey: req.headers['api-key']
    }
  }));

  const mailData = JSON.parse(req.body)

  // Sending email.
  smtpTransport.sendMail(mailData, (error, response) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ sent: !error, response }))
  });
}
