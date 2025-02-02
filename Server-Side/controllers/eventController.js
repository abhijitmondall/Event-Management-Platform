const Event = require("./../models/eventModel");
const User = require("./../models/userModel");
const catchAsync = require("../utils/catchAsync");
const ApiFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");
const uploadFile = require("../utils/cloudinary");
const multerUpload = require("../utils/multerUpload");

const { socketObj } = require("../socketIo");

// Upload Event Image
exports.uploadEventImage = multerUpload("eventImg", "eventImage");

exports.createEvent = catchAsync(async (req, res, next) => {
  let body = req.body;
  body.author = JSON.parse(req.body?.author);

  if (req.file) {
    const filename = await uploadFile(req.file.path);
    body.eventImage = filename;
  }
  const event = await Event.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      event,
    },
  });
});

// Get Specific User Events
exports.getUserEvents = catchAsync(async (req, res, next) => {
  const email = req.user.email;

  const currentUser = await User.findOne({ email });
  if (!currentUser) {
    return next(
      new AppError("You don not have permission to perform this action!", 403)
    );
  }

  const features = new ApiFeatures(
    Event.find({ "author.email": email }),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .search();

  const currentUserEvents = await features.query;

  res.status(200).json({
    status: "success",
    results: currentUserEvents.length,
    data: {
      userEvents: currentUserEvents,
    },
  });
});

// Get All Events
exports.getAllEvents = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Event.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .search();

  const events = await features.query;

  res.status(200).json({
    status: "success",
    results: events.length,
    data: {
      events,
    },
  });
});

// Get Single Event
exports.getEvent = catchAsync(async (req, res, next) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    return next(
      new AppError(`No event found with this ID: ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    status: "success",
    data: {
      event,
    },
  });
});

// Update Event
exports.updateEvent = catchAsync(async (req, res, next) => {
  let body = req.body;

  body.author = JSON.parse(req.body.author);

  const event = await Event.findById(req.params.id);

  if (req?.file) {
    const filename = await uploadFile(req.file.path);
    body.eventImage = filename;
  }

  if (
    event?.author?.email !== req?.user?.email &&
    (req?.user?.role !== "Admin" || req?.user?.role !== "User")
  ) {
    body = {
      bookedSeats: body.bookedSeats,
      attendees: body.attendees,
    };
  }

  const updatedEvent = await Event.findByIdAndUpdate(req.params.id, body, {
    new: true,
    runValidators: true,
  }).select("-createdAt -updatedAt -__v");

  if (!updatedEvent) {
    return next(
      new AppError(`No event found with this ID: ${req.params.id}`, 404)
    );
  }

  // Real Time Update for Event Attendees
  socketObj.io.emit("eventUpdated", {
    eventId: updatedEvent._id,
    ...updatedEvent,
  });

  res.status(200).json({
    status: "success",
    data: {
      event: updatedEvent,
    },
  });
});

// Delete Event
exports.deleteEvent = catchAsync(async (req, res, next) => {
  const event = await Event.findByIdAndDelete(req.params.id);

  if (
    event?.author?.email !== req?.user?.email ||
    req?.user?.role !== "Admin"
  ) {
    return next(
      new AppError(`You don not have permission to perform this action!`, 403)
    );
  }

  if (!event) {
    return next(
      new AppError(`No event found with this ID: ${req.params.id}`, 404)
    );
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});
