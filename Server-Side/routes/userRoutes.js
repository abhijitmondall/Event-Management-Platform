const express = require("express");
const userController = require("./../controllers/userController");
const authController = require("./../controllers/authController");
const router = express.Router();

router.post("/signup", userController.uploadUserPhoto, authController.signup);
router.post("/login", authController.login);

router.route("/").post(userController.createUser);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(
    authController.protected,
    authController.restrictTo("Admin"),
    userController.updateUser
  )
  .delete(
    authController.protected,
    authController.restrictTo("Admin"),
    userController.deleteUser
  );

module.exports = router;
