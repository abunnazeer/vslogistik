const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
  tenant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tenant",
    required: true,
    unique: true,
  },
  paymentHistory: [
    {
      date: Date,
      amount: Number,
      status: {
        type: String,
        enum: ["success", "failed"],
      },
    },
  ],
});

module.exports = mongoose.model("Subscription", subscriptionSchema);
