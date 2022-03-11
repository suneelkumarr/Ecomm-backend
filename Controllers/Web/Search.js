const Product = require("../../models/Product.model")
const { Host } = require("../../Helpers/Index")
const { PaginateQueryParams, Paginate } = require("../../Helpers/Pagination")

// Search suggestion
const Suggestion = async (req, res, next) => {
    try {
        const items = []
        const { query } = req.params

        // Text search in products
        const results = await Product.find(
            { $text: { $search: query } },
            { slug: 1, name: 1, "images.small": 1 }
        )
            .limit(5)
            .exec()

        // Modify results
        if (results && results.length) {
            for (let i = 0; i < results.length; i++) {
                const element = results[i];
                items.push({
                    slug: element.slug,
                    name: element.name,
                    image: Host(req) + "uploads/product/small/" + element.images.small
                })
            }
        }

        res.status(200).json({
            status: true,
            data: items
        })
    } catch (error) {
        if (error){
            console.log(error)
            next(error)
        }
    }
}

// Search Result
const Results = async (req, res, next) => {
    try {
        const items = []
        const { query } = req.params
        const { limit, page } = PaginateQueryParams(req.query)

        // Count total documents in matches
        const totalItems = await Product.countDocuments({ $text: { $search: query } }).exec()

        // Find products using text search
        const results = await Product.find(
            { $text: { $search: query } },
            {
                name: 1,
                slug: 1,
                salePrice: 1,
                "images.small": 1
            }
        )
            .sort({ _id: -1 })
            .skip((parseInt(page) * limit) - limit)
            .limit(limit)
            .exec()

        // Modify results
        if (results && results.length) {
            for (let i = 0; i < results.length; i++) {
                const element = results[i]
                items.push({
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
            data: items,
            pagination: Paginate({ page, limit, totalItems })
        })
    } catch (error) {
        if (error) next(error)
    }
}

module.exports = {
    Suggestion,
    Results
}