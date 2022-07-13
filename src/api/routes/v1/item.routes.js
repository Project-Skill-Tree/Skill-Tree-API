const express = require("express");
const itemController = require("../../controllers/item.controller");
const auth = require("../../middlewares/auth");
const router = express.Router();

router.get("/getItems", auth, itemController.getItems);
router.post("/createItem", auth, itemController.createItem);
router.put("/updateItem", auth, itemController.updateItem);
router.delete("/deleteItem", auth, itemController.deleteItem);

module.exports = router;
