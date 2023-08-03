const mongoose = require("mongoose");

const tenantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  contactEmail: {
    type: String,
    required: true,
  },
  subscriptionPlan: {
    type: String,
    enum: ["basic", "premium", "enterprise"], // You can define your own plans
    default: "basic",
  },
  subscriptionExpiry: {
    type: Date,
    default: Date.now() + 30 * 24 * 60 * 60 * 1000, // Defaults to 30 days from registration
  },
});

module.exports = mongoose.model("Tenant", tenantSchema);
