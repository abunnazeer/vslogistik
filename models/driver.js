const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema({
  user: {
    // Reference to User entity
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  currentLocation: {
    latitude: Number,
    longitude: Number,
  },
  availability: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("Driver", driverSchema);
