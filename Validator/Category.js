const Store = category => {
    let errors = {}

    if (!category.name) errors.name = "Name is required"
    if (!category.file) errors.image = "Image is required"

    return {
        errors,
        isValid: Object.keys(errors).length === 0
    }
}

const Update = category => {
    let errors = {}

    if (!category.name) errors.name = "Name is required"

    return {
        errors,
        isValid: Object.keys(errors).length === 0
    }
}

const Image = category => {
    let errors = {}

    if (!category.file) errors.image = "Image is required"

    return {
        errors,
        isValid: Object.keys(errors).length === 0
    }
}

module.exports = {
    Store,
    Update,
    Image
}