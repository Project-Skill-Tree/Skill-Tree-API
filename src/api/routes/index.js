const express = require("express");
const router = express.Router();

router.use("/", require("./v1/skill.routes"));
router.use("/v1/items", require("./v1/item.routes"));
router.use("/v1/challenges", require("./v1/challenge.routes"));
router.use("/v1/users", require("./v1/user.routes"));
router.use("/v1/tasks", require("./v1/task.routes"));
router.use("/v1", require("./v1/routes"));

module.exports = router;
