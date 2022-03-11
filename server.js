const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fileupload = require('express-fileupload');
const nocache = require('nocache')
const compression = require('compression');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
app.use(compression());
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(fileupload());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(nocache());


app.use('/uploads/banner', express.static('uploads/banner/'))
app.use('/uploads/category', express.static('uploads/category/'))
app.use('/uploads/product/additional', express.static('uploads/product/additional/'))
app.use('/uploads/product/large', express.static('uploads/product/large/'))
app.use('/uploads/product/small', express.static('uploads/product/small/'))
app.use('/uploads/customer', express.static('uploads/customer/'))
app.use('/uploads/order', express.static('uploads/order/'))

// Routes
const Route = require('./Routes/Index')


// API URL's
app.use("/api/v1/", Route)

app.get('/', async (req, res) => {
    res.send("Wow!😯 are you here🙃🙃 but you have no access!!! 😜😜😜")
})

app.use((req, res, next) => {
    let error = new Error('404 page Not Found')
    error.status = 404
    next(error)
})


// app.use((error, req, res, next) => {
//     if (error.status == 404) {
//         return res.status(404).json({
//             message: error.message
//         })
//     }
//     if (error.status == 400) {
//         return res.status(400).json({
//             message: "Bad request"
//         })
//     }
//     if (error.status == 401) {
//         return res.status(401).json({
//             message: "You have no permission"
//         })
//     }
//     return res.status(500).json({
//         message: "Internal Server Error"
//     })
// })

//mongo db connection 
mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("Database connected"))
    .catch(error => {
        if (error) console.log('Failed to connect DB')
    })



const port = process.env.PORT || 4000
app.listen(port, () => {
    console.log(`App running on ${port} port`)
})