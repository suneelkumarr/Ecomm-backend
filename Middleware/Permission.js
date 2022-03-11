const jwt = require('jsonwebtoken')
const Role = require('../models/Role.model')
const {RouteGroupName} = require('../Helpers/Index')

const Admin = async (req, res, next) => {
    try{
        const pathGroup = RouteGroupName(req.path)
        const token = await req.headers.authorization
        if(!token) return res.status(404).json({message:'Token not found'})

        //decode token
        const splitToken = await req.headers.authorization.split(' ')[1]
        const decode = await jwt.verify(splitToken, process.env.JWT_SECRET)

        //math with roles

        const isRole = await Role.findOne({
            $or:[
                {
                    $and:[
                        {role:decode.role},
                        {rights:{$in:[pathGroup]}}
                    ]
                },
                {
                    $and:[{role:decode.role}, {rights:{$in:["all"]}}]
                }
            ]
        }).exec()

        if(!isRole) return res.status(501).json({message:"you have no access."})

        req.user = decode
        next()
    }catch(err){

        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(410).json({ message: 'Token expired' })
            }
            return res.status(501).json({ message: 'unauthorized request' })
        }
    }
}


// Customer Permission

const Customer = async (req, res, next) => {
    try{
        const token = await req.headers.authorization
        if(!token) return res.status(404).json({message:"Token not found"})

        //decode token
        const splitToken = await req.headers.authorization.split(' ')[1]
        const decode = await jwt.verify(splitToken, process.env.JWT_SECRET)

        //check role
        if(decode.role === 'Customer'){
            req.user = decode
            next()
        }else{
            return res.status(401).json({ message: 'You have no permissions to access' })
        }
    } catch (error) {
        if (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(410).json({ message: 'Token expired' })
            }
            return res.status(501).json({ message: 'unauthorized request' })
        }
    }
}


module.exports = {
    Admin,
    Customer
}