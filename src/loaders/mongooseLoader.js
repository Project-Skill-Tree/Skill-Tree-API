require("dotenv").config();
const mongoose = require('mongoose');

function load() {
  mongoose.connection.on("connect", () => console.log("MongoDB connected"));

  mongoose.connect(process.env.DB_KEY, {useNewUrlParser: true, useUnifiedTopology: true}, (err) => {
    if (err) {
      console.log("Error: ",err);
    } else {
      console.log("Connected to db successfully");
    }
  });
}

module.exports = load;
