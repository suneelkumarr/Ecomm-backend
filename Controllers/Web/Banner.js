const Banner = require("../../models/Banner.model")
const { Host } = require("../../Helpers/Index")

// List of banners
const Index = async (req, res, next) => {
    try {
        let results = await Banner.find({}, { image: 1, category: 1 })
            .populate("category", "slug")
            .sort({ _id: -1 })

        results = await results.map(banner => {
            return {
                _id: banner._id,
                category: banner.category ? banner.category.slug : null,
                image: Host(req) + "uploads/banner/" + banner.image
            }
        })

        res.status(200).json({
            status: true,
            data: results
        })
    } catch (error) {
        if (error) next(error)
    }
}


module.exports = {
    Index
}