const Order = require("../../models/Order.model")
const CheckId = require("../../Middleware/CheckId")
const Validator = require("../../Validator/Order")
const { Host } = require("../../Helpers/Index")
const { PaginateQueryParams, Paginate } = require("../../Helpers/Pagination")

// List of orders
const Index = async (req, res, next) => {
    try {
        const { limit, page } = PaginateQueryParams(req.query)

        const totalItems = await Order.countDocuments().exec()
        const results = await Order.find({}, { orderCode: 1, createdAt: 1, status: 1 })
            .sort({ _id: -1 })
            .skip((parseInt(page) * limit) - limit)
            .limit(limit)
            .exec()

        res.status(200).json({
            status: true,
            data: results,
            pagination: Paginate({ page, limit, totalItems })
        })
    } catch (error) {
        if (error) next(error)
    }
}

// Show specific order
const Show = async (req, res, next) => {
    try {
        let order
        const { id } = req.params
        await CheckId(id)

        const result = await Order.findById({ _id: id })
            .populate("customer", "name phone")
            .exec()

        if (result) {
            order = {
                _id: result._id,
                orderCode: result.orderCode,
                customer: result.customer,
                deliveryAddress: result.deliveryAddress,
                deliveryCharge: result.deliveryCharge,
                paymentStatus: result.paymentStatus,
                paymentMethod: result.paymentMethod,
                status: result.status,
                subTotalPrice: result.subTotalPrice,
                totalPrice: result.totalPrice,
                createdAt: result.createdAt,
                products: result.products ? result.products.map(item => {
                    return {
                        _id: item._id,
                        name: item.name,
                        sku: item.sku,
                        purchasePrice: item.purchasePrice,
                        salePrice: item.salePrice,
                        subTotal: item.subTotal,
                        quantity: item.quantity,
                        image: Host(req) + "uploads/order/" + item.image
                    }
                }) : null
            }
        }


        res.status(200).json({
            status: true,
            data: order || null
        })
    } catch (error) {
        if (error) next(error)
    }
}

// Update order status
const UpdateOrderStatus = async (req, res, next) => {
    try {
        const { id } = req.params
        const { status } = req.body
        await CheckId(id)

        // Validation
        const isValidate = await Validator.OrderStatus(req.body)
        if (!isValidate.isValid) {
            return res.status(422).json({
                status: false,
                message: isValidate.error
            })
        }

        const response = await Order.findByIdAndUpdate(
            { _id: id },
            { $set: { status: status, updatedAt: new Date() } },
            { new: true }).exec()

        if (!response) {
            return res.status(404).json({
                status: false,
                message: 'Failed to update order status'
            })
        }

        res.status(201).json({
            status: true,
            message: 'Successfully order status updated.'
        })
    } catch (error) {
        if (error) next(error)
    }
}

// Update payment status
const UpdatePaymentStatus = async (req, res, next) => {
    try {
        const { id } = req.params
        const { status } = req.body
        await CheckId(id)

        const isValidate = await Validator.PaymentStatus(req.body)
        if (!isValidate.isValid) {
            return res.status(422).json({
                status: false,
                message: isValidate.error
            })
        }

        const response = await Order.findByIdAndUpdate(
            { _id: id },
            { $set: { paymentStatus: status, updatedAt: new Date() } },
            { new: true }).exec()

        if (!response) {
            return res.status(404).json({
                status: false,
                message: 'Failed to update payment status'
            })
        }

        res.status(201).json({
            status: true,
            message: 'Successfully payment status updated.'
        })
    } catch (error) {
        if (error) next(error)
    }
}

module.exports = {
    Index,
    Show,
    UpdateOrderStatus,
    UpdatePaymentStatus
}