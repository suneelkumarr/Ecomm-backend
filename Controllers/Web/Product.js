const Product = require("../../models/Product.model")
const { Host } = require("../../Helpers/Index")

// Show specific product
const Show = async (req, res, next) => {
    try {
        const { slug } = req.params

        // Find product
        let result = await Product.findOne(
            { slug: slug },
            {
                purchasePrice: 0,
                createdAt: 0,
                updatedAt: 0
            }
        )
            .populate({
                path: "reviews",
                select: "_id rating review customer",
                options: { sort: { _id: -1 } },
                populate: {
                    path: 'customer',
                    select: { _id: 0, name: 1 }
                }
            })
            .exec()

        if (result) {
            result.images.small = Host(req) + "uploads/product/small/" + result.images.small
            result.images.large = Host(req) + "uploads/product/large/" + result.images.large

            let additional = []
            if (result.images.additional && result.images.additional.length) {
                for (let i = 0; i < result.images.additional.length; i++) {
                    const item = Host(req) + "uploads/product/additional/" + result.images.additional[i]
                    additional.push(item)
                }
            }
            result.images.additional = additional
        }

        res.status(200).json({
            status: true,
            data: result || null
        })
    } catch (error) {
        if (error) next(error)
    }
}

module.exports = {
    Show
}