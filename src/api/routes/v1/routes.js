const express = require("express");
const controller = require("../../controllers/controller");
const auth = require("../../middlewares/auth");

const router = express.Router();

router.get("/getNodes", auth, controller.getNodes);
router.get("/inList", auth, controller.inList);
module.exports = router;
