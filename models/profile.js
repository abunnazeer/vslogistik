const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  firstName: { type: String, default: "" },
  lastName: { type: String, default: "" },
  dateOfBirth: Date,
  profilePicture: String,
  bio: { type: String, default: "" },
});

const Profile = mongoose.model("Profile", profileSchema);

module.exports = Profile;
