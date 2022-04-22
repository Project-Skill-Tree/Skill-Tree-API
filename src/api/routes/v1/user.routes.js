const UserController = require("../../controllers/user.controller")
var express = require('express');
var router = express.Router();


router.route("/").post(UserController.registerUser);
router.post("/login", UserController.authUser);
router.route("/profile").post(UserController.updateUserProfile)
router.delete('/',UserController.removeUser);
module.exports = router;