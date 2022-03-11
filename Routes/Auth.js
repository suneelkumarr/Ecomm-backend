const express = require('express')
const authRouter = express.Router()
const AdminAuth = require("../Controllers/Auth/Admin")
const CustomerAuth = require("../Controllers/Auth/Customer")
const AdminController = require("../Controllers/Admin/Admin")

// Admin auth
authRouter.post("/admin/login", AdminAuth.Login)
authRouter.post("/admin/reset", AdminAuth.Reset)
authRouter.post("/admin", AdminController.Create)

// Customer auth
authRouter.post("/customer/login", CustomerAuth.Login)
authRouter.post("/customer/register", CustomerAuth.Register)

module.exports = { authRouter }