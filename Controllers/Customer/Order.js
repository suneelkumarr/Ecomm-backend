const Order = require("../../models/Order.model")
const Product = require("../../models/Product.model")
const Customer = require("../../models/Customer.model")
const Validator = require("../../Validator/Order")
const CheckId = require("../../Middleware/CheckId")
const { UniqueCode, CopyFile, Host } = require("../../Helpers/Index")

// Stock update
const StockUpdate = async (id, quantity) => {
    try {
        const result = await Product.findByIdAndUpdate(
            { _id: id },
            { $inc: { stockAmount: -quantity } },
            { multi: false }
        ).exec()

        if (result) return true
    } catch (error) {
        if (error) return error
    }
}

// List of orders
const Index = async (req, res, next) => {
    try {
        const results = await Order.find(
            { customer: req.user.id },
            { orderCode: 1, createdAt: 1, status: 1 }
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

// Show specific order
const Show = async (req, res, next) => {
    try {
        let order
        const { id } = req.params
        await CheckId(id)

        const result = await Order.findById(
            { _id: id },
            { customer: 0, updatedAt: 0, "products.purchasePrice": 0 }
        ).exec()


        if (result) {
            order = {
                _id: result._id,
                orderCode: result.orderCode,
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

// Place order
const Place = async (req, res, next) => {
    try {
        const deliveryCharge = 100
        let subTotalAmout = 0
        let totalAmount = 0
        const { id } = req.user
        const {
            deliveryAddress,
            items
        } = req.body

        // Validation
        const isValidate = await Validator.Place(req.body)
        if (!isValidate.isValid) {
            return res.status(422).json({
                status: false,
                message: isValidate.errors
            })
        }

        const orderedProducts = []
        if (items && items.length) {
            for (let i = 0; i < items.length; i++) {
                const element = items[i]
                const foundProduct = await Product.findById({ _id: element.product })

                if (foundProduct) {
                    subTotalAmout += foundProduct.salePrice * element.quantity

                    // Stock update
                    await StockUpdate(foundProduct._id, element.quantity)

                    // Copy file to order directory
                    const oldPath = `uploads/product/small/${foundProduct.images.small}`
                    const newPath = `uploads/order/${foundProduct.images.small}`

                    await CopyFile(oldPath, newPath)

                    orderedProducts.push({
                        product: foundProduct._id,
                        name: foundProduct.name,
                        sku: foundProduct.sku,
                        image: foundProduct.images.small,
                        quantity: element.quantity,
                        purchasePrice: foundProduct.purchasePrice,
                        salePrice: foundProduct.salePrice,
                        subTotal: foundProduct.salePrice * element.quantity
                    })
                }
            }
        }

        // Calc total amount
        totalAmount = subTotalAmout + deliveryCharge

        // Order code
        const orderCode = await UniqueCode(6)

        // New order object
        const newOrder = new Order({
            orderCode,
            customer: id,
            deliveryAddress,
            deliveryCharge,
            subTotalPrice: subTotalAmout,
            totalPrice: totalAmount,
            products: [...orderedProducts]
        })

        // create order
        const createOrder = await newOrder.save()
        if (!createOrder) {
            return res.status(501).json({
                status: false,
                message: "Network error!"
            })
        }

        // address update
        await Customer.findByIdAndUpdate(
            id,
            { $push: { deliveryAddress: deliveryAddress } }
        )

        res.status(201).json({
            status: true,
            message: "Successfully order created."
        })
    } catch (error) {
        if (error) next(error)
    }
}

module.exports = {
    Index,
    Show,
    Place
}