const express = require('express')
const adminRouter = express.Router()
const AdminController = require("../Controllers/Admin/Admin")
const ProfileController = require("../Controllers/Admin/Profile")
const DashboardController = require("../Controllers/Admin/Dashboard")
const OptionController = require("../Controllers/Admin/Option")
const CategoryController = require("../Controllers/Admin/Category")
const BannerController = require("../Controllers/Admin/Banner")
const ProductController = require("../Controllers/Admin/Product")
const CustomerController = require("../Controllers/Admin/Customer")
const OrderController = require("../Controllers/Admin/Order")

// ----------- Admin Routes ------------
adminRouter.get("/admin", AdminController.Index)
// adminRouter.post("/admin", AdminController.Create)
adminRouter.get("/admin/:id", AdminController.Show)
adminRouter.put("/admin/:id", AdminController.Update)

// ----------- Admin Profile Routes ------------
adminRouter.get("/profile", ProfileController.MyProfile)
adminRouter.put("/profile", ProfileController.UpdateProfile)
adminRouter.put("/profile/change-password", ProfileController.UpdatePassword)

//  ---------- Dashboard Route -----------
adminRouter.get("/dashboard", DashboardController.Index)

//  ---------- Option Route -----------
adminRouter.get("/options", OptionController.Index)

//  ---------- Category Routes -----------
adminRouter.get("/category", CategoryController.Index)
adminRouter.post("/category", CategoryController.Store)
adminRouter.get("/category/:id", CategoryController.Show)
adminRouter.put("/category/:id", CategoryController.Update)

//  --------- Banner Routes -------------
adminRouter.get("/banner", BannerController.Index)
adminRouter.post("/banner", BannerController.Store)
adminRouter.delete("/banner/:id", BannerController.Delete)

//  --------- Product Routes ------------ 
adminRouter.get("/product", ProductController.Index)
adminRouter.post("/product", ProductController.Store)
adminRouter.get("/product/:id", ProductController.Show)
adminRouter.put("/product/:id", ProductController.Update)
adminRouter.put("/product/sm-image/:id", ProductController.UpdateSMImage)
adminRouter.put("/product/additional-image/:id", ProductController.AddAdditionalImage)
adminRouter.delete("/product/additional-image/:id/:file", ProductController.RemoveAdditionalImage)
adminRouter.post("/product/search", ProductController.Search)
adminRouter.delete("/product/:id", ProductController.Destroy)

//  --------- Customer Routes ------------ 
adminRouter.get("/customer", CustomerController.Index)
adminRouter.post("/customer", CustomerController.Store)
adminRouter.get("/customer/:id", CustomerController.Show)
adminRouter.put("/customer/:id", CustomerController.Update)
adminRouter.post("/customer/search", CustomerController.Search)
adminRouter.get("/customer/:id/orders", CustomerController.Orders)
adminRouter.delete("/customer/:id", CustomerController.Destroy)

//  --------- Order Routes ------------ 
adminRouter.get("/order", OrderController.Index)
adminRouter.get("/order/:id", OrderController.Show)
adminRouter.put("/order/change-order-status/:id", OrderController.UpdateOrderStatus)
adminRouter.put("/order/change-payment-status/:id", OrderController.UpdatePaymentStatus)

module.exports = { adminRouter }