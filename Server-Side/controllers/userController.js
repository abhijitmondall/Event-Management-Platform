const multer = require("multer");

const ApiFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const User = require("./../models/userModel");

const getUserData = (req) => {
  return {
    name: req.body.name,
    email: req.body.email,
    photo: req.body.photo,
    gender: req.body.gender,
  };
};

const multerStorage = multer.diskStorage({
  destination: "public/img",
  filename: (req, file, cb) => {
    cb(
      null,
      `user-${Math.floor(
        1000000 + Math.random() * 9000000
      ).toString()}-${Date.now()}.jpeg`
    );
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

// Upload Photo
exports.uploadUserPhoto = upload.single("photo");

// Get User
exports.getUser = catchAsync(async (req, res, next) => {
  const userEmail = req.params.id;
  const user = await User.findOne({ email: userEmail }).select("-__v -role");

  if (!user)
    return next(
      new AppError(`No User found with this ID: ${req.params.id}`, 404)
    );

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

// Create User
exports.createUser = catchAsync(async (req, res, next) => {
  const existingUser = await User.findOne({ email: req.body.email });

  if (existingUser)
    return res.status(200).json({ message: "User already exists!" });

  const user = await User.create(getUserData(req));

  res.status(201).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const userEmail = req.user.email;

  const user = await User.findOneAndUpdate({ email: userEmail }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!user)
    return next(
      new AppError(`No User found with this ID: ${req.params.id}`, 404)
    );

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

// Delete User
exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user)
    return next(
      new AppError(`No User found with this ID: ${req.params.id}`, 404)
    );

  res.status(204).json({
    status: "success",
    data: null,
  });
});
