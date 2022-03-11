const Category = require("../../models/Category.model")
const Validator = require("../../Validator/Category")
const CheckId = require("../../Middleware/CheckId")
const { Slug, Host, FileUpload, DeleteFile } = require("../../Helpers/Index")

// Index of categories
const Index = async (req, res, next) => {
    try {
        let results = await Category.find({}, { name: 1, image: 1, products: 1 }).sort({ _id: -1 }).exec()

        // Modify category
        if (results.length) {
            results = await results.map(item => {
                return {
                    _id: item._id,
                    name: item.name,
                    products: item.products.length,
                    image: item.image ? Host(req) + "uploads/category/" + item.image : null
                }
            })
        }

        res.status(200).json({
            status: true,
            data: results
        })

    } catch (error) {
        if (error) next(error)
    }
}

// Store new category
const Store = async (req, res, next) => {
    try {
        const { name } = req.body
        const file = req.files

        // validate check
        const validate = await Validator.Store({ name, file })
        if (!validate.isValid) return res.status(422).json(validate.errors)

        let category = await Category.findOne({ name }).exec()
        if (category) {
            return res.status(409).json({
                status: false,
                message: 'This category already exist'
            })
        }

        const uploadFile = await FileUpload(file.image, './uploads/category/')
        const newCategory = new Category({
            name: name,
            slug: Slug(name),
            image: uploadFile
        })

        await newCategory.save()

        res.status(201).json({
            status: true,
            message: 'Successfully category cretaed'
        })
    } catch (error) {
        if (error) next(error)
    }
}


// Show a category
const Show = async (req, res, next) => {
    try {
        const { id } = req.params
        await CheckId(id)

        let item = await Category.findById({ _id: id }, { slug: 0, createdAt: 0, updatedAt: 0 })

        if (!item) {
            return res.status(204).json({
                status: false,
                message: 'Category not found'
            })
        }

        if (item.image) item.image = Host(req) + "uploads/category/" + item.image

        res.status(200).json({
            status: true,
            data: item
        })

    } catch (error) {
        if (error) next(error)
    }
}


// Update Category
const Update = async (req, res, next) => {
    try {
        let uploadFile
        const { id } = req.params
        const { name } = req.body
        await CheckId(id)

        // Check available
        const category = await Category.findOne({ _id: id }).exec()
        if (!category) {
            return res.status(404).json({
                status: false,
                message: 'Category not found'
            })
        }

        // Check name exist
        let exist = await Category.findOne({ $and: [{ _id: { $ne: id } }, { name: name }] })
        if (exist) {
            return res.status(409).json({
                status: false,
                message: 'This category already exist'
            })
        }


        // if file available
        if (req.files && req.files.image) {

            // Delete old file
            await DeleteFile('./uploads/category/', category.image)

            // Upload new file
            uploadFile = await FileUpload(req.files.image, './uploads/category/')
            if (!uploadFile) {
                return res.status(501).json({
                    status: false,
                    message: 'Failed to upload image, Internat server error'
                })
            }
        }

        const updateCategory = await Category.findOneAndUpdate(
            { _id: id },
            {
                $set: {
                    name: name,
                    image: req.files ? uploadFile : category.image
                }
            },
            { new: true }).exec()

        if (!updateCategory) {
            return res.status(422).json({
                status: false,
                message: 'Failed to update'
            })
        }

        return res.status(201).json({
            status: false,
            message: 'Successfully category updated'
        })
    } catch (error) {
        if (error) next(error)
    }
}

module.exports = {
    Index,
    Store,
    Show,
    Update
}