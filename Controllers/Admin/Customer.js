const _ = require('lodash')
const bcrypt = require('bcryptjs')
const Order = require('../../models/Order.model')
const Customer = require('../../models/Customer.model')
const CheckId = require('../../Middleware/CheckId')
const Validator = require('../../Validator/Customer')
const { PaginateQueryParams, Paginate } = require('../../Helpers/Pagination')

// List of customers
const Index = async (req, res, next) => {
    try {
        const { limit, page } = PaginateQueryParams(req.query)

        const totalItems = await Customer.countDocuments().exec()
        const customers = await Customer.find({}, { name: 1, email: 1, phone: 1, gender: 1 })
            .sort({ _id: -1 })
            .skip((parseInt(page) * limit) - limit)
            .limit(limit)
            .exec()

        res.status(200).json({
            status: true,
            data: customers,
            pagination: Paginate({ page, limit, totalItems })
        })
    } catch (error) {
        if (error) next(error)
    }
}

// Store customer
const Store = async (req, res, next) => {
    try {
        const {
            name,
            email,
            phone,
            gender,
            maritalStatus,
            dob,
            shippingArea,
            deliveryAddress,
            password
        } = req.body

        // validate check
        const validate = await Validator.CreateByAdmin(req.body)
        if (validate.isValid === false) {
            return res.status(422).json({
                status: false,
                message: validate.error
            })
        }

        // Check email
        const existEmail = await Customer.findOne({ email: email })
        if (existEmail)
            return res.status(422).json({
                status: false,
                message: 'Email already used.'
            })

        // Check phone
        const existPhone = await Customer.findOne({ phone: phone })
        if (existPhone)
            return res.status(422).json({
                status: false,
                message: 'Phone already used.'
            })

        // Password Hash
        const hashPassword = await bcrypt.hash(password, 10)
        const newCustomer = new Customer({
            name,
            email,
            phone,
            gender,
            maritalStatus,
            dob,
            shippingArea,
            deliveryAddress,
            password: hashPassword
        })

        const saveUser = await newCustomer.save()
        if (!saveUser)
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

// Show specific customer
const Show = async (req, res, next) => {
    try {
        const { id } = req.params
        await CheckId(id)

        let customer = await Customer.findOne({ _id: id }, { password: 0 })
            .exec()

        if (!customer) {
            return res.status(404).json({
                status: false,
                message: 'Customer not found.'
            })
        }

        customer.deliveryAddress = _.last(customer.deliveryAddress)

        res.status(200).json({
            status: true,
            data: customer
        })
    } catch (error) {
        if (error) next(error)
    }
}

// Update specific customer
const Update = async (req, res, next) => {
    try {
        const { id } = req.params
        await CheckId(id)
        const {
            name,
            email,
            phone,
            gender,
            maritalStatus,
            dob
        } = req.body

        // validate check
        const validate = await Validator.Update(req.body)
        if (validate.isValid === false) {
            return res.status(422).json({
                status: false,
                message: validate.error
            })
        }

        const updateCustomer = await Customer.findByIdAndUpdate(
            { _id: id },
            {
                $set: {
                    name,
                    email,
                    phone,
                    gender,
                    maritalStatus,
                    dob
                }
            }
        ).exec()

        if (!updateCustomer) {
            return res.status(501).json({
                status: false,
                message: 'Failed to update customer'
            })
        }

        res.status(201).json({
            status: true,
            message: 'Successfully customer updated'
        })
    } catch (error) {
        if (error) next(error)
    }
}

// Search customer (name, email, phone)
const Search = async (req, res, next) => {
    try {
        const { query } = req.body

        if (!query) {
            return res.status(422).json({
                status: false,
                query: 'Query is required'
            })
        }

        let queryValue = new RegExp(query, 'i')
        let results = await Customer.find(
            { $or: [{ name: queryValue }, { email: queryValue }, { phone: queryValue }] },
            { name: 1, email: 1, phone: 1, gender: 1 }
        )
            .sort({ _id: -1 })
            .exec()

        res.status(200).json({
            status: true,
            data: results
        })
    } catch (error) {
        if (error) next(error)
    }
}

// Customer orders
const Orders = async (req, res, next) => {
    try {
        const { id } = req.params
        await CheckId(id)

        const results = await Order.find(
            { customer: id },
            { orderCode: 1, createdAt: 1, status: 1, totalPrice: 1 }
        )
            .sort({ _id: -1 })
            .exec()

        res.status(200).json({
            status: true,
            data: results
        })
    } catch (error) {
        if (error) next(error)
    }
}

// Delete specific item
const Destroy = async (req, res, next) => {
    try {
        const { id } = req.params
        await CheckId(id)

        const is_available = await Customer.findById(id)
        if (!is_available) {
            return res.status(404).json({
                status: false,
                message: "Customer not available."
            })
        }

        await Customer.findByIdAndDelete(id)

        res.status(200).json({
            status: true,
            message: "Successfully deleted."
        })
    } catch (error) {
        if (error) next(error)
    }
}

module.exports = {
    Index,
    Store,
    Show,
    Update,
    Search,
    Orders,
    Destroy
}