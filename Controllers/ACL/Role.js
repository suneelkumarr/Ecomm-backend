const Role = require("../../models/Role.model");
const CheckId = require("../../Middleware/CheckId");
const Validator = require("../../Validator/Role");

//List of items
const Index = async (req, res, next) => {
  try {
    const results = await Role.find({}, { role: 1, rights: 1 })
      .sort({ role: 1 })
      .exec();
    res.status(200).json({ status: true, data: results });
  } catch (err) {
    if (err) next(err);
  }
};

const Store = async (req, res, next) => {
  try {
    const { role, rights } = req.body;

    //validate checks
    const validate = await Validator.Store(req.body);
    if (!validate.isValid) {
      return res.status(422).json({ status: false, message: validate.error });
    }

    //check exits
    const isExit = await Role.findOne({ role: role }).exec();
    if (isExit) {
      return res
        .status(409)
        .json({ status: false, message: `${role} already created` });
    }

    const newRole = new Role({
      role,
      rights,
    });

    //save role
    const saveRole = await newRole.save();
    if (!saveRole) {
      return res.status(501).json({
        status: false,
        message: "Failed to create role !",
      });
    }
    res.status(201).json({
      status: true,
      message: `Successfully ${role} created`,
    });
  } catch (error) {
    if (error) next(error);
  }
};

//show specific item
const Show = async (req, res, next) => {
  try {
    const { id } = req.params;
    await CheckId(id);

    const result = await Role.findOne(
      { _id: id },
      { role: 1, rights: 1 }
    ).exec();
    if (!result) {
      return res
        .status(404)
        .json({ status: false, message: "No role found !" });
    }

    res.status(200).json({ status: true, data: result });
  } catch (err) {
    if (err) next(err);
  }
};

// update specific item
const Update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role, rights } = req.body;
    await CheckId(id);

    //validate check
    const validate = await Validator.Store(req.body);
    if (!validate.isValid) {
      return res.status(422).json({
        status: false,
        message: validate.error,
      });
    }

    // Check available with name
    const nameAvailable = await Role.find({
      $and: [{ _id: { $ne: id } }, { role: role }],
    }).exec();

    if (nameAvailable.length) {
      return res.status(409).json({
        status: false,
        message: "Another role already available !",
      });
    }

    // Update available role
    const updateRole = await Role.findOneAndUpdate(
      { _id: id },
      { $set: { role, rights } }
    ).exec();

    if (!updateRole) {
      return res.status(501).json({
        status: false,
        message: "Failed to update role !",
      });
    }

    res.status(201).json({
      status: true,
      message: "Successfully role updated.",
    });
  } catch (err) {
    if (error) next(error);
  }
};

// Delete specific item
const Delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    await CheckId(id);

    // delete item
    const isDelete = await Role.findOneAndDelete({ _id: id }).exec();
    if (!isDelete) {
      return res.status(501).json({
        status: false,
        message: "Failed to delete !",
      });
    }

    res.status(200).json({
      status: true,
      message: "Successfully role deleted.",
    });
  } catch (error) {
    if (error) next(error);
  }
};

module.exports = {
  Index,
  Store,
  Show,
  Update,
  Delete,
};
