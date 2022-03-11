const Store = banner => {
    let errors = {}

    if (!banner.category) errors.category = "Category is required"
    if (!banner.file) errors.image = "Image is required"

    return {
        errors,
        isValid: Object.keys(errors).length === 0
    }
}

module.exports = {
    Store
}