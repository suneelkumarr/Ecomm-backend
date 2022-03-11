const Product = require("../../models/Product.model")
const Category = require("../../models/Category.model")
const Validator = require("../../Validator/Product")
const CheckId = require("../../Middleware/CheckId")
const { PaginateQueryParams, Paginate } = require("../../Helpers/Pagination")
const { Slug, Host, SmFileUpload, LgFileUpload, DeleteFile } = require("../../Helpers/Index")

// Index of products
const Index = async (req, res, next) => {
    try {
        const { limit, page } = PaginateQueryParams(req.query)

        const totalItems = await Product.countDocuments().exec()
        let results = await Product.find(
            {},
            {
                name: 1,
                sku: 1,
                purchasePrice: 1,
                salePrice: 1,
                stockAmount: 1,
                'images.small': 1
            }
        )
            .populate("category", "name")
            .sort({ _id: -1 })
            .skip((parseInt(page) * limit) - limit)
            .limit(limit)
            .exec()


        if (results.length) {
            results = await results.map(product => {
                return {
                    _id: product._id,
                    name: product.name,
                    sku: product.sku,
                    purchasePrice: product.purchasePrice,
                    salePrice: product.salePrice,
                    stockAmount: product.stockAmount,
                    category: product.category ? product.category.name : null,
                    thumbnail: Host(req) + "uploads/product/small/" + product.images.small
                }
            })
        }

        res.status(200).json({
            status: true,
            data: results,
            pagination: Paginate({ page, limit, totalItems })
        })

    } catch (error) {
        if (error) next(error)
    }
}

// Store a product
const Store = async (req, res, next) => {
    try {
        let uploadedAdditional = []

        const {
            name,
            category,
            tags,
            sku,
            stockAmount,
            purchasePrice,
            salePrice,
            additionalInfo,
            description,
            video
        } = req.body

        const reqObj = {
            ...req.body,
            image: req.files && req.files.image ? req.files.image : null,
            images: req.files && req.files.images ? req.files.images : null
        }

        // validate check
        const validate = await Validator.Store(reqObj)
        if (!validate.isValid) return res.status(422).json(validate.errors)

        const image = req.files.image
        const images = req.files.images

        // Find with SKU
        const existSKU = await Product.findOne({ sku: sku }).exec()
        if (existSKU) {
            return res.status(422).json({
                status: false,
                message: 'This SKU already exist'
            })
        }

        // Upload small & large thumbnail
        const uploadSmallThumb = await SmFileUpload(image, 'uploads/product/small')
        const uploadLargeThumb = await LgFileUpload(image, 'uploads/product/large')

        // Upload multiple thumbnail
        if (images && images.length) {
            for (let i = 0; i < images.length; i++) {
                const fileName = await LgFileUpload(images[i], 'uploads/product/additional')
                uploadedAdditional.push(fileName)
            }
        }

        const newProduct = new Product({
            name,
            category,
            tags,
            sku,
            stockAmount,
            purchasePrice,
            salePrice,
            additionalInfo: additionalInfo ? JSON.parse(additionalInfo) : null,
            description,
            video,
            slug: Slug(name),
            images: {
                small: uploadSmallThumb,
                large: uploadLargeThumb,
                additional: [...uploadedAdditional]
            }
        })

        if (uploadSmallThumb && uploadLargeThumb) {

            // Add to category
            await Category.findOneAndUpdate(
                { _id: category },
                { $push: { products: newProduct._id } },
                { new: true }
            ).exec()

            // Store product
            const storeProduct = await newProduct.save()

            if (storeProduct) {
                return res.status(201).json({
                    status: true,
                    message: "Successfully product stored"
                })
            }
        }
    } catch (error) {
        if (error) {
            console.log(error)
            next(error)
        }
    }
}

// Show specific product
const Show = async (req, res, next) => {
    try {
        const { id } = req.params
        await CheckId(id)

        let product = await Product.findById({ _id: id })
            .populate('category', 'name slug')

        if (product) {
            product.images.small = Host(req) + "uploads/product/small/" + product.images.small
            product.images.large = Host(req) + "uploads/product/large/" + product.images.large

            let additionalImages = []
            if (product.images.additional && product.images.additional.length) {
                for (let i = 0; i < product.images.additional.length; i++) {
                    const item = Host(req) + "uploads/product/additional/" + product.images.additional[i]
                    additionalImages.push(item)
                }
            }
            product.images.additional = additionalImages
        }

        res.status(200).json({
            status: true,
            data: product || null
        })

    } catch (error) {
        if (error) next(error)
    }
}

// Update specific product
const Update = async (req, res, next) => {
    try {
        const { id } = req.params
        await CheckId(id)

        const {
            name,
            category,
            tags,
            sku,
            stockAmount,
            purchasePrice,
            salePrice,
            additionalInfo,
            description,
            video
        } = req.body

        // validate check
        const validate = await Validator.Update(req.body)
        if (!validate.isValid) return res.status(422).json(validate.errors)

        // Find with ID
        const foundProduct = await Product.findById({ _id: id })
        if (!foundProduct) {
            return res.status(404).json({
                status: false,
                message: 'Product not found.'
            })
        }

        // Find with SKU
        const existSKU = await Product.findOne({ $and: [{ _id: { $ne: id } }, { sku: sku }] }).exec()
        if (existSKU) {
            return res.status(422).json({
                status: false,
                message: 'This SKU already exist'
            })
        }

        // Remove product form category
        await Category.findOneAndUpdate(
            { _id: foundProduct.category },
            { $pull: { products: { $in: [`${foundProduct._id}`] } } },
            { multi: true }
        ).exec()

        // Update category with new product
        await Category.findOneAndUpdate(
            { _id: category },
            { $push: { products: id } },
            { new: true }
        ).exec()

        // Update product
        const updateProduct = await Product.findByIdAndUpdate(
            { _id: id },
            {
                $set: {
                    name,
                    category,
                    tags,
                    sku,
                    stockAmount,
                    purchasePrice,
                    salePrice,
                    additionalInfo,
                    description,
                    video
                }
            }
        ).exec()

        if (!updateProduct) {
            return res.status(501).json({
                status: false,
                message: 'Failed to update product, try again.'
            })
        }

        res.status(201).json({
            status: true,
            message: 'Successfully product updated.'
        })
    } catch (error) {
        if (error) next(error)
    }
}

// Update specific product small image
const UpdateSMImage = async (req, res, next) => {
    try {
        const { id } = req.params
        await CheckId(id)

        // Check image available / not
        if (!req.files) return res.status(422).json({ image: "Image is required" })

        const image = req.files.image

        // Find product
        const foundProduct = await Product.findById({ _id: id }).exec()
        if (!foundProduct) {
            return res.status(404).json({
                status: false,
                message: 'Product not found.'
            })
        }

        const smallThum = foundProduct.images.small
        const largeThum = foundProduct.images.large

        // Delete old file
        await DeleteFile('./uploads/product/small/', smallThum)
        await DeleteFile('./uploads/product/large/', largeThum)

        // Upload small & large image
        const uploadSmallThumb = await SmFileUpload(image, 'uploads/product/small')
        const uploadLargeThumb = await LgFileUpload(image, 'uploads/product/large')

        if (uploadSmallThumb && uploadLargeThumb) {
            const updateProduct = await Product.findByIdAndUpdate(
                { _id: id },
                { $set: { "images.small": uploadSmallThumb, "images.large": uploadLargeThumb } }
            ).exec()

            if (!updateProduct) {
                return res.status(501).json({
                    status: false,
                    message: 'Failed to update thumbnail.'
                })
            }

            return res.status(201).json({
                status: true,
                message: 'Successfully thumbnail updated.'
            })
        }
    } catch (error) {
        if (error) next(error)
    }
}

// Add new additional image
const AddAdditionalImage = async (req, res, next) => {
    try {
        const { id } = req.params
        await CheckId(id)

        // Check image available / not
        if (!req.files) return res.status(422).json({ image: "Image is required" })

        // Move file to destination
        const image = req.files.image
        const fileName = await LgFileUpload(image, 'uploads/product/additional')

        // Update file name
        const updatedFile = await Product.findOneAndUpdate(
            { _id: id },
            { $push: { "images.additional": fileName } }
        ).exec()

        // Check updated
        if (!updatedFile) {
            return res.status(501).json({
                status: false,
                message: 'Failed to upload.'
            })
        }

        res.status(201).json({
            status: true,
            message: 'Successfully image uploaded.'
        })
    } catch (error) {
        if (error) next(error)
    }
}

// Remove specific additional image
const RemoveAdditionalImage = async (req, res, next) => {
    try {
        const { id, file } = req.params
        await CheckId(id)

        // Remove file 
        const removeFile = await Product.findOneAndUpdate(
            { _id: id },
            { $pull: { "images.additional": { $in: [`${file}`] } } },
            { multi: false }
        ).exec()

        // Remove old file from directory 
        await DeleteFile('./uploads/product/additional/', file)

        // Check remove
        if (!removeFile) {
            return res.status(501).json({
                status: false,
                message: 'Failed to delete image'
            })
        }

        res.status(200).json({
            status: true,
            message: 'Successfully image deleted.'
        })
    } catch (error) {
        if (error) next(error)
    }
}

// Search product using SKU/Name
const Search = async (req, res, next) => {
    try {
        const { query } = req.body
        if (!query) {
            return res.status(422).json({
                status: false,
                query: 'Query is required'
            })
        }

        let queryValue = new RegExp(query, 'i')
        let results = await Product.find(
            { $or: [{ name: queryValue }, { sku: queryValue }] },
            {
                name: 1,
                sku: 1,
                purchasePrice: 1,
                salePrice: 1,
                stockAmount: 1,
                'images.small': 1
            }
        )
            .populate("category", "name")
            .sort({ _id: -1 })
            .exec()

        if (results && results.length) {
            results = await results.map(product => {
                return {
                    _id: product._id,
                    name: product.name,
                    sku: product.sku,
                    purchasePrice: product.purchasePrice,
                    salePrice: product.salePrice,
                    stockAmount: product.stockAmount,
                    isActive: product.isActive,
                    brand: product.brand ? product.brand.name : null,
                    vendor: product.vendor ? product.vendor.name : null,
                    category: product.category ? product.category.name : null,
                    thumbnail: Host(req) + "uploads/product/small/" + product.images.small
                }
            })
        }

        res.status(200).json({
            status: true,
            data: results || []
        })
    } catch (error) {
        if (error) next(error)
    }
}

// Delete specific item
const Destroy = async (req, res, next) => {
    try {
        const { id } = req.params
        await CheckId(id)

        const is_available = await Product.findById(id)
        if (!is_available) {
            return res.status(404).json({
                status: false,
                message: "Product not available."
            })
        }

        // Delete old file
        await DeleteFile('./uploads/product/small/', is_available.images.small)
        await DeleteFile('./uploads/product/large/', is_available.images.large)

        // Remove old file from directory 

        if (is_available.images.additional) {
            for (let i = 0; i < is_available.images.additional.length; i++) {
                const element = is_available.images.additional[i];
                await DeleteFile('./uploads/product/additional/', element)
            }
        }

        await Product.findByIdAndDelete(id)

        res.status(200).json({
            status: true,
            message: "Successfully deleted."
        })
    } catch (error) {
        if (error) next(error)
    }
}


module.exports = {
    Index,
    Store,
    Show,
    Update,
    UpdateSMImage,
    AddAdditionalImage,
    RemoveAdditionalImage,
    Search,
    Destroy
}