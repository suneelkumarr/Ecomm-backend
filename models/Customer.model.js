const mongoose = require('mongoose')
const Schema = mongoose.Schema

const validateEmail = function (email) {
    if (email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email)
    }
    return true
}

const customerSchema = new Schema({
    name:{
        type:String,
        trim:true,
        required:true
    },
    email:{
        type:String,
        unique:true,
        trim:true,
        lowercase:true,
        validate: [validateEmail, "Please provide a valid email address"],
        default: null
    },
    phone:{
        type:String,
        trim:true,
        required:true
    },
    gender:{
        type:String,
        trim:true,
        default: null,
        enum:[null, "Male","Female","Other"]
    },
    maritalStatus:{
        type:String,
        trim:true,
        default:null,
        enum:[null, "Single", "Married", "Separated", "Divorced", "Widowed"]
    },
    dob:{
        type:Date,
        trim:true,
        default: null
    },
    shippingArea:[{
        type:String,
        trim:true,
        default: null
    }],
    deliveryAddress: [{
        type: String,
        trim: true,
        default: null
    }],
    password: {
        type: String,
        trim: true,
        required: true
    },
    image: {
        type: String,
        trim: true,
        default: null
    },
    role: {
        type: String,
        trim: true,
        default: 'Customer',
        enum: ['Customer']
    },
},{
    timestamps: true
})

const Customer = mongoose.model("Customer", customerSchema)
module.exports = Customer