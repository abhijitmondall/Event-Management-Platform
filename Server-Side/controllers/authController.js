const catchAsync = require("../utils/catchAsync");
const User = require("./../models/userModel");
const AppError = require("../utils/appError");

const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const uploadFile = require("../utils/cloudinary");

const signToken = (id, res) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.cookie("jwt", token, {
    maxAge: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  return token;
};

// Sign Up user
exports.signup = catchAsync(async (req, res, next) => {
  let body = req.body;

  const emailExists = await User.findOne({ email: body.email });
  if (emailExists) {
    return next(new AppError("Email already exists!", 400));
  }

  if (req.file) {
    const filename = await uploadFile(req.file.path);
    body.photo = filename;
  }
  const user = await User.create(body);
  const token = signToken(user._id, res);
  user.password = undefined;

  res.status(201).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 403));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password, user.password))) {
    return next(
      new AppError("User not found. Incorrect email or password!", 403)
    );
  }

  const token = signToken(user._id, res);
  user.password = undefined;

  res.status(200).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
});

// Guest login
exports.guestLogin = catchAsync(async (req, res, next) => {
  // Check if a guest user already exists
  let guest = await User.findOne({ role: "Guest" });

  if (!guest) {
    // Create a guest user if it doesn't exist
    guest = await User.create({
      name: "Guest",
      email: "guest@domain.com",
      password: "guestPassword123",
      confirmPassword: "guestPassword123",
      gender: "Other",
      role: "Guest",
    });
  }

  // Generate a JWT token for the guest user
  const token = signToken(guest._id, res);

  // Send the response with the JWT token
  res.status(200).json({
    status: "success",
    token,
    data: {
      user: guest,
    },
  });
});

// Protected Middleware
exports.protected = catchAsync(async (req, res, next) => {
  // 1. Getting token and check if it's exists
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access!", 401)
    );
  }

  // 2. Verify the token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3. Check if user still exists
  const currentUser = await User.findById({ _id: decoded.id });
  if (!currentUser) {
    return next(
      new AppError("The User belonging to this token no longer exists!", 401)
    );
  }

  // 4 Grand Access to protected route
  req.user = currentUser;
  next();
});

// Role based authentication/authorization
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // Here Roles will be an Array
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You don not have permission to perform this action!", 403)
      );
    }

    next();
  };
};
