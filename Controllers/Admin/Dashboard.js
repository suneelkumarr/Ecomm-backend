const Admin = require("../../models/Admin.model")
const Customer = require("../../models/Customer.model")
const Category = require("../../models/Category.model")
const Product = require("../../models/Product.model")

// Index of dashboard
const Index = async (req, res, next) => {
    try {
        const admin = await Admin.countDocuments()
        const customer = await Customer.countDocuments()
        const category = await Category.countDocuments()
        const product = await Product.countDocuments()

        res.status(200).json({
            status: true,
            admin,
            customer,
            category,
            product
        })
    } catch (error) {
        if (error) next(error)
    }
}


module.exports = {
    Index
}