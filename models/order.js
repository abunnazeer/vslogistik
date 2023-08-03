const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  productDetails: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["placed", "inTransit", "delivered"],
    default: "placed",
  },
  user: {
    // Reference to User entity
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  driver: {
    // Reference to Driver entity
    type: mongoose.Schema.Types.ObjectId,
    ref: "Driver",
  },
});

module.exports = mongoose.model("Order", orderSchema);
