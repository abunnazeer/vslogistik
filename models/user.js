const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    // Make sure to hash this before saving
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["tenantAdmin", "user", "driver"],
    default: "user",
  },
  tenant: {
    // Reference to Tenant entity
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tenant",
    required: true,
  },
  isAdmin: { type: Boolean, default: false },
});

module.exports = mongoose.model("User", userSchema);
