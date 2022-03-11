const mongoose = require('mongoose')

module.exports = id => {
    if(!mongoose.isValidObjectId(id)){
        let error = new Error()
        error.status = 404
        throw error
    }
}