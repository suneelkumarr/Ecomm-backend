const mongoose = require('mongoose')
const Schema = mongoose.Schema

const orderSchema = new Schema({
    orderCode:{
        type:String,
        trim:true,
        required:true,
    },
    customer:{
        type:Schema.Types.ObjectId,
        ref:'Customer',
        required:true
    },
    deliveryAddress:{
        type:String,
        required:true,
        trim:true,
    },
    paymentMethod:{
        type:String,
        default:"COD",
        enum:["COD", "SSLCOMMERZ"]
    },
    deliveryCharge:{
        type:Number,
        required:true,
        trim:true,
    },
    subTotalPrice:{
        type:Number,
        required:true,
        trim:true,
    },
    totalPrice:{
        type:Number,
        required:true,
        trim:true,
    },
    paymentStatus: {
        type: String,
        default: "Pending",
        enum: ["Paid", "Pending", "Partially Paid"]
    },
    status: {
        type: String,
        default: "Created",
        enum: [
            "Created",
            "Pending",
            "Confirmed",
            "Picked",
            "Received in Warehouse",
            "Packed",
            "Handed Over to Courier",
            "Delivered",
            "Cancelled"
        ]
    },
    products: [{
        product: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
        name: {
            type: String,
            trim: true,
            required: true
        },
        sku: {
            type: String,
            trim: true,
            required: true
        },
        image: {
            type: String,
            trim: true,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        purchasePrice: {
            type: Number,
            trim: true,
            default: null
        },
        salePrice: {
            type: Number,
            trim: true,
            default: null
        },
        subTotal: {
            type: Number,
            trim: true,
            required: true
        }
    }],
},{
    timestamps: true
})

const Order = mongoose.model("Order", orderSchema)
module.exports = Order