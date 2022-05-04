const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * Item object
 * @param name - item name
 * @param link - URL link
 * @param requires - The required skills to unlock
 * @param emoji - Emoji representing this item
 */
const itemSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: false
  },
  link: {
    type: String,
    required: true
  },
  requires: {
    type: [Schema.Types.ObjectId],
    required: true,
    unique: false
  },
  emoji: {
    type: String,
    required: true,
  },
}, { collection: "Items" });

module.exports = mongoose.model("Item", itemSchema);