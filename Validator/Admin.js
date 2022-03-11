const Login = user =>{
    let error = {}

    if(!user.email) error.email = "Email is required"
    if(!user.password) error.password = "Password is required"

    return {
        error,
        isValid: Object.keys(error).length === 0
    }
}


const Create = user =>{
    let error = {}
    if(!user.name) error.name = "Name is required"
    if(!user.email) error.email = "Email is required"
    if(!user.phone) error.phone = "Phone is required"
    if(!user.presentAddress) error.presentAddress = "Present Address is required"
    if(!user.permanentAddress) error.permanentAddress = "Premanent Address is required"
    if(!user.role) error.role ="Role is required"
    if(!user.password) error.password = "Password is required"

    return {
        error,
        isValid: Object.keys(error).length === 0
    }
}


const Update = user =>{
    let error = {}

    if(!user.name) error.name = "Name is required"
    if(user.name && user.name.length > 5) error.name = "Name must be greather then 5 characters"
    if (!user.presentAddress) error.presentAddress = "Present address is required"
    if (!user.permanentAddress) error.permanentAddress = "Permanent address is required"
    if (!user.role) error.role = "Role is required"
    if (!user.accountStatus) error.accountStatus = "Account status is required"

    return {
        error,
        isValid: Object.keys(error).length === 0
    }
}


const UpdateProfile = user => {
    let error = {}

    if (!user.name) error.name = "Name is required"
    if (!user.phone) error.phone = "Phone is required"
    if (!user.presentAddress) error.presentAddress = "Present address is required"
    if (!user.permanentAddress) error.permanentAddress = "Permanent address is required"

    return {
        error,
        isValid: Object.keys(error).length === 0
    }
}

const UpdatePassword = data => {
    let error = {}

    if (!data.oldPassword) error.oldPassword = "Old password is required"
    if (!data.newPassword) error.newPassword = "New password is required"

    return {
        error,
        isValid: Object.keys(error).length === 0
    }
}


module.exports = {
    Login, Create, Update, UpdateProfile, UpdatePassword,
}