const Product = require("../../models/Product.model")
const Category = require("../../models/Category.model")
const { Host } = require("../../Helpers/Index")


// List of categories with product
const Index = async (req, res, next) => {
    try {
        // Find categories 
        const results = await Category.find({}, { name: 1, slug: 1 })
            .sort({ name: 1 })
            .exec()

        res.status(200).json({
            status: true,
            data: results || []
        })
    } catch (error) {
        if (error) next(error)
    }
}

// Show specific category
const Show = async (req, res, next) => {
    try {
        const { slug } = req.params

        let result = await Category.findOne(
            { slug: slug },
            { slug: 1, name: 1, image: 1 })
            .exec()

        if (result) result.image = result.image ? Host(req) + "uploads/category/" + result.image : null

        res.status(200).json({
            status: true,
            data: result || null
        })
    } catch (error) {
        if (error) next(error)
    }
}

// Specific category products
const Products = async (req, res, next) => {
    try {
        let products = []
        const { category } = req.params
        const { page } = req.query

        // Find matched products
        const results = await Product.find(
            { category: category },
            {
                name: 1,
                slug: 1,
                salePrice: 1,
                "images.small": 1
            }
        )
            .sort({ _id: -1 })
            .skip((parseInt(page || 1) * 28) - 28)
            .limit(28)
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

// List of category names
const ListOfCategory = async (req, res, next) => {
    try {
        const results = await Category.find({}, { slug: 1, name: 1 })
            .sort({ name: 1 })
            .exec()

        res.status(200).json({
            status: true,
            data: results
        })
    } catch (error) {
        if (error) next(error)
    }
}


module.exports = {
    Index,
    Show,
    Products,
    ListOfCategory
}