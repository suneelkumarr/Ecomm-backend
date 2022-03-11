const express = require('express')
const webRouter = express.Router()

const HomeController = require("../Controllers/Web/Home")
const BannerController = require("../Controllers/Web/Banner")
const CategoryController = require("../Controllers/Web/Category")
const ProductController = require("../Controllers/Web/Product")
const SearchController = require("../Controllers/Web/Search")
const MailController = require("../Controllers/Web/Mail")

// ------ Home -------
webRouter.get("/home-products", HomeController.Index)

// ------ Banner -------
webRouter.get("/banner", BannerController.Index)

// ------ Category -------
webRouter.get("/category", CategoryController.Index)
webRouter.get("/category/:slug", CategoryController.Show)
webRouter.get("/category/products/:category", CategoryController.Products)
webRouter.get("/category/name/slug/list", CategoryController.ListOfCategory)

// ------ Product -------
webRouter.get("/product/:slug", ProductController.Show)

// ------ Search -------
webRouter.get("/search/suggestion/:query", SearchController.Suggestion)
webRouter.get("/search/results/:query", SearchController.Results)

// ------ Mail -------
webRouter.post("/mail", MailController.MailSender)

module.exports = { webRouter }