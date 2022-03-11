const mongoose = require('mongoose')
const Schema = mongoose.Schema

const roleSchema = new Schema({
    role: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    rights: [{
        type: String,
        required: true,
        trim: true
    }]
}, {
    timestamps: true  
})

const Role = mongoose.model('Role', roleSchema)
module.exports = Role