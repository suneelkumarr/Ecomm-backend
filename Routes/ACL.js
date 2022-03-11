const express = require("express")
const aclRouter = express.Router()
const Routes = require("../Controllers/ACL/Routes")
const Role = require("../Controllers/ACL/Role")

//  --- Role ---
aclRouter.get("/role", Role.Index)
aclRouter.post("/role", Role.Store)
aclRouter.get("/role/:id", Role.Show)
aclRouter.put("/role/:id", Role.Update)
aclRouter.delete("/role/:id", Role.Delete)
aclRouter.get("/role/route/paths", Routes.Index)

module.exports = { aclRouter }