const Login = customer => {
    let error = {}

    if (!customer.phone) error.phone = "Phone is required"
    if (!customer.password) error.password = "Password is required"

    return {
        error,
        isValid: Object.keys(error).length === 0
    }
}

const Create = customer => {
    let error = {}

    if (!customer.name) error.name = "Name is required"
    if (customer.name && customer.name.length < 5) error.name = "Name must be greater than 5 character"
    if (!customer.phone) error.phone = "Phone Number is Required"
    if (!customer.password) error.password = "Password is required"

    return {
        error,
        isValid: Object.keys(error).length === 0
    }
}

const CreateByAdmin = customer => {
    let error = {}

    if (!customer.name) error.name = "Name is required"
    if (customer.name && customer.name.length < 5) error.name = "Name must be greater than 5 character"
    if (!customer.email) error.email = "Email is required"
    if (!customer.phone) error.phone = "Phone Number is Required"

    if (!customer.gender) error.gender = "Gender is Required"

    const genderType = ['Male', 'Female', 'Other'].find(item => item === customer.gender)
    if (customer.gender && !genderType) error.gender = `${customer.gender} is not valid gender`

    if (!customer.maritalStatus) error.maritalStatus = "Marital status is Required"

    const statusType = ["Single", "Married", "Separated", "Divorced", "Widowed"].find(item => item === customer.maritalStatus)
    if (customer.maritalStatus && !statusType) error.maritalStatus = `${customer.maritalStatus} is not valid`

    if (!customer.dob) error.dob = "Date of birth is Required"
    if (!customer.shippingArea) error.shippingArea = "Shipping area is Required"
    if (!customer.deliveryAddress) error.deliveryAddress = "Delivery address is Required"
    if (!customer.password) error.password = "Password is required"
  
    return {
        error,
        isValid: Object.keys(error).length === 0
    }
}

const Update = customer => {
    let error = {}

    if (!customer.name) error.name = "Name is required"
    if (customer.name && customer.name.length < 5) error.name = "Name must be greater than 5 character"
    if (!customer.email) error.email = "Email is required"
    if (!customer.phone) error.phone = "Phone Number is Required"

    if (!customer.gender) error.gender = "Gender is Required"

    const genderType = ['Male', 'Female', 'Other'].find(item => item === customer.gender)
    if (customer.gender && !genderType) error.gender = `${customer.gender} is not valid gender`

    if (!customer.maritalStatus) error.maritalStatus = "Marital status is Required"

    const statusType = ["Single", "Married", "Separated", "Divorced", "Widowed"].find(item => item === customer.maritalStatus)
    if (customer.maritalStatus && !statusType) error.maritalStatus = `${customer.maritalStatus} is not valid`

    if (!customer.dob) error.dob = "Date of birth is Required"

    return {
        error,
        isValid: Object.keys(error).length === 0
    }
}

const PasswordChange = data => {
    let errors = {}

    if (!data.oldPassword) errors.oldPassword = "Old Password is required"
    if (!data.newPassword) errors.newPassword = "New Password is required"

    return {
        errors,
        isValid: Object.keys(errors).length === 0
    }
}


module.exports = {
    Login,
    Create,
    CreateByAdmin,
    Update,
    PasswordChange
}