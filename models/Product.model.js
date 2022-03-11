const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 250
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        require: true
    },
    tags: [{
        type: String,
        required: true,
        trim: true
    }],
    sku: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    stockAmount: {
        type: Number,
        required: true,
        trim: true
    },
    purchasePrice: {
        type: Number,
        required: true,
        trim: true
    },
    salePrice: {
        type: Number,
        required: true,
        trim: true
    },
    additionalInfo: [{
        title: {
            type: String,
            trim: true,
            default: null
        },
        value: {
            type: String,
            trim: true,
            default: null
        }
    }],
    description: {
        type: String,
        trim: true,
        required: true
    },
    video: {
        type: String,
        trim: true,
        default: null
    },
    images: {
        small: {
            type: String,
            trim: true,
            required: true
        },
        large: {
            type: String,
            trim: true,
            required: true
        },
        additional: [
            {
                type: String,
                trim: true,
                required: true
            }
        ]
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }],
}, {
    timestamps: true
})

productSchema.index({
    name: "text",
    tags: "text",
    sku: "text"
})

const Product = mongoose.model('Product', productSchema)
module.exports = Product;