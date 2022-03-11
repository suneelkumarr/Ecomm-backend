const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const Admin = require("../../models/Admin.model")
const Validator = require("../../Validator/Admin")
const { UniqueCode, SendEmail } = require("../../Helpers/Index")

// Login to account
const Login = async (req, res, next) => {
    try {
        const { email, password } = req.body

        // validate check
        const validate = await Validator.Login({ email, password })
        if (validate.isValid === false) {
            return res.status(422).json({
                status: false,
                message: validate.error
            })
        }

        // Account find using email 
        const account = await Admin.findOne({ email: email })
            .populate("role")
            .exec()

        if (!account) {
            return res.status(404).json({
                status: false,
                message: 'Invalid e-mail or password'
            })
        }

        // Check blocked
        if (account.accountStatus === 'Deactive') {
            return res.status(422).json({
                status: false,
                message: 'Your account has been blocked from admin.'
            })
        }

        // Compare with password
        const result = await bcrypt.compare(password, account.password)
        if (!result) {
            return res.status(404).json({
                status: false,
                message: 'Invalid e-mail or password'
            })
        }

        // Generate JWT token
        const token = await jwt.sign(
            {
                id: account._id,
                name: account.name,
                role: account.role.role,
                permissions: account.role.rights
            }, process.env.JWT_SECRET, { expiresIn: '1d' }
        )

        return res.status(200).json({
            status: true,
            token
        })

    } catch (error) {
        if (error) next(error)
    }
}

// Reset Password
const Reset = async (req, res, next) => {
    try {
        const { email } = req.body

        if (!email) {
            return res.status(422).json({
                status: false,
                email: "email address required."
            })
        }

        // Find account
        const account = await Admin.findOne({ email }, { password: 0 }).exec()
        if (!account) {
            return res.status(404).json({
                status: false,
                message: "Account not found."
            })
        }

        // Generate unique password
        const uniquePassword = await UniqueCode(8)

        // Password Hash
        const hashPassword = await bcrypt.hash(uniquePassword, 10)

        // Update account password
        const updateAccount = await Admin.findOneAndUpdate(
            { email: email },
            { $set: { password: hashPassword } },
            { $multi: false }
        ).exec()

        if (!updateAccount) {
            return res.status(404).json({
                status: false,
                message: 'Failed to update'
            })
        }

        // Mail data
        const mailData = {
            from: '"GrapFood" <no-reply@famefair.com.bd>',
            to: email,
            subject: "Password Reset",
            body: `<p>Your new password <b>${uniquePassword}, don't share with anyone.</b></p>`,
        }

        // Sent verification code to e-mail
        const isMailSent = await SendEmail(mailData)
        if (!isMailSent) {
            return res.status(404).json({
                status: false,
                message: 'Failed to sent password to e-mail.'
            })
        }

        res.status(201).json({
            status: true,
            message: "Check your e-mail a new password send to your email.",
        })
    } catch (error) {
        if (error) next(error)
    }
}

module.exports = {
    Login,
    Reset
}