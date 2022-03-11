const Banner = require("../../models/Banner.model");
const Validator = require("../../Validator/Banner");
const CheckId = require("../../Middleware/CheckId");
const { Host, DeleteFile, FileUpload } = require("../../Helpers/Index");

// List of banners

const Index = async (req, res, next) => {
  try {
    let results = await Banner.find({}, { image: 1, category: 1 })
      .populate("category", "name")
      .sort({ _id: -1 });

    if (results && results.length) {
      results = await results.map((banner) => {
        return {
          _id: banner._id,
          category: banner.category ? banner.category.name : null,
          image: Host(req) + "uploads/banner/" + banner.image,
        };
      });
    }

    res.status(200).json({
      status: true,
      data: results,
    });
  } catch (err) {
    if (err) next(err);
  }
};

// Store Banner
const Store = async (req, res, next) => {
  try {
    const { category } = req.body;
    const file = req.files;

    //validate check
    const validate = await Validator.Store({ category, file });
    if (!validate.isValid) return res.status(422).json(validate.errors);

    const uploadFile = await FileUpload(file.image, "./uploads/banner/");
    if (!uploadFile) {
      return res.status(501).json({
        status: false,
        message: "Failed to upload banner",
      });
    }

    const newBanner = new Banner({
      image: uploadFile,
      category,
    });

    const saveBanner = await newBanner.save();

    if (!saveBanner) {
      return res.status(501).json({
        status: false,
        message: "Failed to upload banner",
      });
    }

    res.status(201).json({
      status: true,
      message: "Successfully banner uploaded",
    });
  } catch (err) {
    if (err) next(err);
  }
};

// Delete banner
const Delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    await CheckId(id);

    const findBanner = await Banner.findOne({ _id: id }, { image: 1 });
    if (!findBanner)
      return res.status(404).json({
        status: false,
        message: "Banner not found",
      });

    //Dalete old file
    await DeleteFile("./uploads/banner/", findBanner.image);

    //Delete banner from DB
    const result = await Banner.findOneAndDelete({ _id: id });

    if (!result) {
      return res.status(501).json({
        status: false,
        message: "Failed to delete banner",
      });
    }

    res.status(200).json({
      status: true,
      message: "Successfully banner deleted",
    });
  } catch (err) {
    if (err) next(err);
  }
};


module.exports = {
    Index,
    Store,
    Delete
}