const Review = require("../../models/Review.model")
const Product = require("../../models/Product.model")
const Validator = require("../../Validator/Review")

// Store a review
const Store = async (req, res, next) => {
    try {
        const user = req.user.id
        const { product, rating, review } = req.body

        // validate check
        const validate = await Validator.Store({ user, product, rating, review })
        if (!validate.isValid) {
            return res.status(422).json({
                status: false,
                message: validate.errors
            })
        }

        // Find product
        const foundProduct = await Product.findById({ _id: product }, { _id: 1 }).exec()
        if (!foundProduct) {
            return res.status(404).json({
                status: false,
                message: 'Product not found'
            })
        }

        // New Review
        const newReview = new Review({
            customer: user,
            product,
            rating,
            review
        })

        // Update product reviews
        const updateProduct = await Product.findByIdAndUpdate(
            { _id: product },
            { $push: { reviews: newReview._id } },
            { new: true }
        ).exec()

        if (!updateProduct) {
            return res.status(501).json({
                status: false,
                message: "Network error."
            })
        }

        //    Save rating & review
        const saveRatingReview = await newReview.save()
        if (!saveRatingReview) {
            return res.status(501).json({
                status: false,
                message: "Network error."
            })
        }

        res.status(201).json({
            status: true,
            message: 'Successfully your rating & review submitted.'
        })
    } catch (error) {
        if (error) {
            console.log(error)
            next(error)
        }
    }
}


module.exports = {
    Store
}