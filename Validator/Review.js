const Store = data => {
    let errors = {}
    let reviewRatingError = true

    if (!data.user) errors.user = "User ID is required."
    if (!data.product) errors.product = "Product ID is required."
    if (data.rating) reviewRatingError = false
    else if (data.review) reviewRatingError = false
    else reviewRatingError = true

    if(reviewRatingError) errors.reviewRating = "Rating or Review is required."

    return {
        errors,
        isValid: Object.keys(errors).length === 0
    }
}

module.exports = { Store }