const express = require('express')
const router = express.Router()
const { Admin, Customer } = require("../Middleware/Permission")

const { webRouter } = require("./Web")
const { authRouter } = require("./Auth")
const { adminRouter } = require("./Admin")
const { customerRouter } = require("./Customer")
const { aclRouter } = require("./ACL")

router.use("/web", webRouter)
router.use("/auth", authRouter)

router.use("/admin", Admin, adminRouter)
router.use("/customer", Customer, customerRouter)

router.use("/acl",Admin, aclRouter)

module.exports = router