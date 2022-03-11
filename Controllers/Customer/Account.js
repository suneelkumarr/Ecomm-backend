const bcrypt = require("bcryptjs")
const Customer = require("../../models/Customer.model")
const Validator = require("../../Validator/Customer")

// My profile
const MyProfile = async (req, res, next) => {
    try {
        const { id } = req.user
        const result = await Customer.findById(
            { _id: id },
            { password: 0 }
        )
            .exec()

        res.status(200).json({
            status: true,
            data: result || null
        })
    } catch (error) {
        if (error) next(error)
    }
}

// Update Account
const UpdateAccount = async (req, res, next) => {
    try {
        let isUpdateAccount
        const user = req.user.id
        const { name, email, gender, maritalStatus, dob } = req.body

        // validate check
        const validate = await Validator.Update(req.body)
        if (!validate.isValid) {
            return res.status(422).json({
                status: false,
                message: validate.error
            })
        }

        // Check email
        if (email) {
            const existAccount = await Customer.findOne({ email: email }).exec()

            if (existAccount) {

                // Update account
                isUpdateAccount = await Customer.findOneAndUpdate(
                    { _id: user },
                    { $set: { name, gender, maritalStatus, dob } },
                    { $multi: false }
                ).exec()
            } else {
                // Update account
                isUpdateAccount = await Customer.findOneAndUpdate(
                    { _id: user },
                    { $set: { name, email: email, gender, maritalStatus, dob } },
                    { $multi: false }
                ).exec()
            }
        }

        if (!isUpdateAccount) {
            return res.status(404).json({
                status: false,
                message: 'Failed to update account.'
            })
        }

        res.status(201).json({
            status: true,
            message: "Successfully account updated."
        })
    } catch (error) {
        if (error) next(error)
    }
}

// Update password
const UpdatePassword = async (req, res, next) => {
    try {
        const { id } = req.user
        const { oldPassword, newPassword } = req.body

        // validate check
        const validate = await Validator.PasswordChange(req.body)
        if (!validate.isValid) {
            return res.status(422).json({
                status: false,
                message: validate.error
            })
        }

        // find account
        const foundAccount = await Customer.findById({ _id: id }, { password: 1 })
        if (!foundAccount) {
            return res.status(422).json({
                status: false,
                message: "Account not found."
            })
        }

        // Compare with old password
        const isCorrectPassword = await bcrypt.compare(oldPassword, foundAccount.password)
        if (!isCorrectPassword) {
            return res.status(404).json({
                status: false,
                message: "Old password doesn't match."
            })
        }

        // Password Hash
        const hashNewPassword = await bcrypt.hash(newPassword, 10)

        // Update account
        const updateAccount = await Customer.findOneAndUpdate(
            { _id: id },
            { $set: { password: hashNewPassword } },
            { $multi: false }
        ).exec()

        if (!updateAccount) {
            return res.status(404).json({
                status: false,
                message: "Failed to update password"
            })
        }

        res.status(201).json({
            status: true,
            message: "Successfully password updated."
        })
    } catch (error) {
        if (error) next(error)
    }
}

module.exports = {
    MyProfile,
    UpdateAccount,
    UpdatePassword
}