const mongoose = require('mongoose')
const Schema = mongoose.Schema

const categorySchema = new Schema({
    name:{
        type:String,
        require:true,
        unique:true,
        trim:true,
        maxLength:50
    },
    slug:{
        type:String,
        require:true,
        unique:true,
        trim:true,
    },
    image:{
        type:String,
        require:true,
    },
    products:[{
        type:Schema.Types.ObjectId,
        ref:'Product',
        default:null,
    }]
},{
    timestamps:true,
})

const Category = mongoose.model('Category',categorySchema)

module.exports = Category