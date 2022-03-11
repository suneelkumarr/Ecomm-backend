const Product = require("../../models/Product.model")
const { Host } = require("../../Helpers/Index")

// List of home products
const Index = async (req, res, next) => {
    try {
        const products = []
        const { page } = req.query

        // Find products
        const results = await Product.find(
            {},
            {
                name: 1,
                slug: 1,
                salePrice: 1,
                "images.small": 1
            }
        )
            .sort({ _id: -1 })
            .skip((parseInt(page || 1) * 20) - 20)
            .limit(20)
            .exec()

        // Modify results
        if (results && results.length) {
            for (let i = 0; i < results.length; i++) {
                const element = results[i]
                products.push({
                    _id: element._id,
                    slug: element.slug,
                    name: element.name,
                    salePrice: element.salePrice,
                    image: element.images.small ? Host(req) + "uploads/product/small/" + element.images.small : null
                })
            }
        }

        res.status(200).json({
            status: true,
            data: products
        })
    } catch (error) {
        if (error) next(error)
    }
}

module.exports = {
    Index
}