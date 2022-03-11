const Store = product => {
    let errors = {}

    if (!product.name) errors.name = "Name is required"
    if (!product.category) errors.category = "Category is required"
    if (!product.tags) errors.tags = "Tags is required"
    if (!product.sku) errors.sku = "SKU is required"
    if (!product.stockAmount) errors.stockAmount = "Stock amount is required"
    if (!product.purchasePrice) errors.purchasePrice = "Purchase price is required"
    if (!product.salePrice) errors.salePrice = "Sale price is required"
    if (!product.description) errors.description = "Description is required"
    if (!product.image) errors.image = "Image is required"
    if (!product.images) errors.images = "Images is required"

    return {
        errors,
        isValid: Object.keys(errors).length === 0
    }
}

const Update = product => {
    let errors = {}

    if (!product.name) errors.name = "Name is required"
    if (!product.category) errors.category = "Category is required"
    if (!product.tags) errors.tags = "Tags is required"
    if (!product.sku) errors.sku = "SKU is required"
    if (!product.stockAmount) errors.stockAmount = "Stock amount is required"
    if (!product.purchasePrice) errors.purchasePrice = "Purchase price is required"
    if (!product.salePrice) errors.salePrice = "Sale price is required"
    if (!product.description) errors.description = "Description is required"

    return {
        errors,
        isValid: Object.keys(errors).length === 0
    }
}

module.exports = {
    Store,
    Update
}