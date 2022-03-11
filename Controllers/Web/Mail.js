
const nodemailer = require("nodemailer")

// Reset Password
const MailSender = async (req, res, next) => {
    try {
        const { name, email, phone, subject, body } = req.body


        // Mail data
        const mailData = {
            from: '"ecomm" <no-reply@iocommerce.com>',
            to: email,
            subject: subject,
            body: `<p><b>${name}</b> <b>${phone}, </b><br/>${body}</p>`,
        }

        // Sent verification code to e-mail
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: '', /* Reference mail */
                pass: '' /* Reference mail password */
            }
        })

        // send mail with defined transport object
        const isMailSent = await transporter.sendMail({
            from: mailData.from, // sender address
            to: mailData.to, // list of receivers
            subject: mailData.subject, // Subject line
            html: mailData.body // html body
        })

        if (!isMailSent) {
            return res.status(404).json({
                status: false,
                message: 'Failed to sent password to e-mail.'
            })
        }

        res.status(201).json({
            status: true,
            message: "Message sent."
        })
    } catch (error) {
        if (error) {
            console.log(error)
            next(error)
        }
    }
}


module.exports = {
    MailSender
}