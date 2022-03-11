const Category = require("../../models/Category.model")

const Index = async (req, res, next) => {
    try {
        let categories = []

        const categoryResult = await Category.find({}, { name: 1 }).sort({ name: 1 })

        // Generate category options
        if (categoryResult && categoryResult.length) {
            for (let i = 0; i < categoryResult.length; i++) {
                const element = categoryResult[i]
                categories.push({
                    value: element._id,
                    label: element.name
                })
            }
        }

        res.status(200).json({
            status: true,
            categories
        })
    } catch (error) {
        if (error) next(error)
    }
}


module.exports = { Index }