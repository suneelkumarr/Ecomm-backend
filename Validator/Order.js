const Place = data => {
    let errors = {}

    if (!data.deliveryAddress) errors.deliveryAddress = "Delivery address is required"
    if (!data.items) errors.items = "Product items is required"
    if (data.items && !data.items.length) errors.items = "Product items is required"

    return {
        errors,
        isValid: Object.keys(errors).length === 0
    }
}

// Order status validation
const OrderStatus = data => {
    let error = {}

    if (!data.status) error.status = "Status is required !"
    if (data.status) {
        const matches = [
            "Created",
            "Pending",
            "Confirmed",
            "Picked",
            "Received in Warehouse",
            "Packed",
            "Handed Over to Courier",
            "Delivered",
            "Cancelled"
        ].find(item => item === data.status)
        if (!matches) error.status = `${data.status} is not valid.`
    }

    return {
        error,
        isValid: Object.keys(error).length === 0
    }
}

// Payment status validation
const PaymentStatus = data => {
    let error = {}
    if (!data.status) error.status = "Status is required !"

    if (data.status) {
        const matches = [
            'Paid',
            'Pending',
            'Partially Paid'
        ].find(item => item === data.status)
        if (!matches) error.status = `${data.status} is not valid.`
    }

    return {
        error,
        isValid: Object.keys(error).length === 0
    }
}

module.exports = {
    Place,
    OrderStatus,
    PaymentStatus
}