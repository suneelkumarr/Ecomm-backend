const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const Customer = require("../../models/Customer.model")
const Validator = require("../../Validator/Customer")

// Login to account
const Login = async (req, res, next) => {
    try {
        const { phone, password } = req.body

        // Validate check
        const validate = await Validator.Login(req.body)
        if (!validate.isValid) {
            return res.status(422).json({
                status: false,
                message: validate.error
            })
        }

        // Account find using phone 
        const account = await Customer.findOne({ phone: phone }).exec()
        if (!account) {
            return res.status(404).json({
                status: false,
                message: 'Invalid phone or password'
            })
        }

        // Compare with password
        const result = await bcrypt.compare(password, account.password)
        if (!result) {
            return res.status(404).json({
                status: false,
                message: 'Invalid phone or password'
            })
        }

        // Generate JWT token
        const token = await jwt.sign(
            {
                id: account._id,
                name: account.name,
                role: account.role,
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

// Create an account
const Register = async (req, res, next) => {
    try {
        const { name, phone, password } = req.body

        // Validate check
        const validate = await Validator.Create(req.body)
        if (!validate.isValid) {
            return res.status(422).json({
                status: false,
                message: validate.error
            })
        }

        // Check account is exist
        const isExistAccount = await Customer.findOne({ phone: phone }).exec()
        if (isExistAccount) {
            return res.status(422).json({
                status: false,
                message: "Phone number already used."
            })
        }

        // Password Hash
        const hashPassword = await bcrypt.hash(password, 10)

        const newCustomer = new Customer({
            name,
            phone,
            password: hashPassword
        })

        const saveCustomer = await newCustomer.save()
        if (!saveCustomer)
            return res.status(501).json({
                status: false,
                message: 'Failed to create account.'
            })

        res.status(201).json({
            status: true,
            message: 'Successfully account created.'
        })
    } catch (error) {
        if (error) next(error)
    }
}

// Reset password
const Reset = async (req, res, next) => {
    try {

    } catch (error) {
        if (error) next(error)
    }
}


module.exports = {
    Login,
    Register,
    Reset
}