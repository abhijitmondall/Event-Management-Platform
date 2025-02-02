const express = require("express");
const eventController = require("./../controllers/eventController");
const authController = require("./../controllers/authController");
const router = express.Router();

router
  .route("/userEvents")
  .get(authController.protected, eventController.getUserEvents);

router
  .route("/")
  .get(eventController.getAllEvents)
  .post(
    authController.protected,
    authController.restrictTo("User", "Admin"),
    eventController.uploadEventImage,
    eventController.createEvent
  );

router
  .route("/:id")
  .get(authController.protected, eventController.getEvent)
  .patch(
    authController.protected,
    authController.restrictTo("User", "Admin"),
    eventController.uploadEventImage,
    eventController.updateEvent
  )
  .delete(
    authController.protected,
    authController.restrictTo("User", "Admin"),
    eventController.deleteEvent
  );

module.exports = router;
