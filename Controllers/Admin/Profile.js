const bcrypt = require("bcryptjs")
const Admin = require("../../models/Admin.model")
const Validator = require('../../Validator/Admin')

// My profile
const MyProfile = async (req, res, next) => {
    try {
        const { id } = req.user
        const result = await Admin.findById(
            { _id: id },
            {
                status: 0,
                accountStatus: 0,
                password: 0
            }
        )
            .populate("role", "role")
            .exec()

        res.status(200).json({
            status: true,
            data: result || null
        })
    } catch (error) {
        if (error) next(error)
    }
}

// Update profile
const UpdateProfile = async (req, res, next) => {
    try {
        const { id } = req.user
        const { name, phone, presentAddress, permanentAddress } = req.body

        // validate check
        const validate = await Validator.UpdateProfile(req.body)
        if (!validate.isValid) {
            return res.status(422).json({
                status: false,
                message: validate.error
            })
        }

        const findAdmin = await Admin.findById({ _id: id })
        if (!findAdmin) {
            return res.status(404).json({
                status: false,
                message: 'Account not found.'
            })
        }

        const updateAdmin = await Admin.findOneAndUpdate(
            { _id: id },
            {
                $set: {
                    name,
                    phone,
                    "address.presentAddress": presentAddress,
                    "address.permanentAddress": permanentAddress
                }
            }
        )

        if (!updateAdmin) {
            return res.status(501).json({
                status: false,
                message: 'Failed to update profile.'
            })
        }

        res.status(201).json({
            status: true,
            message: 'Successfully account updated.'
        })
    } catch (error) {
        if (error) next(error)
    }
}

// Change password
const UpdatePassword = async (req, res, next) => {
    try {
        const { id } = req.user
        const { newPassword, oldPassword } = req.body

        // validate check
        const validate = await Validator.UpdatePassword(req.body)
        if (!validate.isValid) {
            return res.status(422).json({
                status: false,
                message: validate.error
            })
        }

        const account = await Admin.findOne({ _id: id })
        if (!account) {
            return res.status(404).json({
                status: false,
                message: 'Account not found.'
            })
        }

        // Compare with password
        const result = await bcrypt.compare(oldPassword, account.password)
        if (!result) {
            return res.status(404).json({
                status: false,
                message: "Old password doesn't match"
            })
        }

        // Password Hash
        const hashPassword = await bcrypt.hash(newPassword, 10)

        const updatePassword = await Admin.findOneAndUpdate(
            { _id: id },
            { $set: { password: hashPassword } }
        ).exec()

        if (!updatePassword) {
            return res.status(501).json({
                status: false,
                message: 'Failed to change password.'
            })
        }

        res.status(201).json({
            status: true,
            message: 'Successfully password updated.'
        })

    } catch (error) {
        if (error) next(error)
    }
}


module.exports = {
    MyProfile,
    UpdateProfile,
    UpdatePassword
}