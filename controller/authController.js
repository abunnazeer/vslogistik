const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    // Check if user exists
    let user = await User.findOne({ username: req.body.username });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // Check if passwords match
    if (req.body.password !== req.body.confirmPassword) {
      return res.status(400).json({ msg: "Passwords do not match" });
    }
    const passwordRegex = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/;

    if (!req.body.password.match(passwordRegex)) {
      return res.status(400).json({ msg: "Password must be alphanumeric" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create new user
    user = new User({
      username: req.body.username,
      password: hashedPassword,
      tenant: req.body.tenant, // You'd set this based on your logic
      role: req.body.role,
    });

    await user.save();

    const emailToken = jwt.sign(
      { userId: user._id, email: user.email },
      "emailSecret",
      { expiresIn: "1d" }
    );

    const url = `http://yourFrontEndUrl/confirmation/${emailToken}`;

    // Send email logic
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "yourEmail@gmail.com",
        pass: "yourPassword",
      },
    });

    let mailOptions = {
      from: "yourEmail@gmail.com",
      to: user.email,
      subject: "Email Verification",
      text: "Click on this link to verify your email: " + url,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
    res.status(201).json({ msg: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

router.get("/confirmation/:token", async (req, res) => {
  try {
    const { userId } = jwt.verify(req.params.token, "emailSecret");

    await User.updateOne({ _id: userId }, { isVerified: true });

    res.send("Email verified!");
  } catch (e) {
    res.send("error");
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });

    if (!user) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }
    if (!user.isVerified) {
      return res.status(401).json({ msg: "Please verify your email to login" });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    // Sign JWT
    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

router.post("/requestPasswordReset", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res
      .status(400)
      .json({ message: "No account with this email address exists." });
  }

  const resetToken = crypto.randomBytes(20).toString("hex");
  const resetExpiration = Date.now() + 3600000; // 1 hour from now

  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = resetExpiration;

  await user.save();

  // Send email (using nodemailer) with the resetToken embedded in a URL...
  // e.g., http://yourfrontend.com/reset?token=${resetToken}
});

router.post("/resetPassword", async (req, res) => {
  const { token, newPassword } = req.body;
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired token." });
  }

  user.password = await bcrypt.hash(newPassword, 10); // Hash the new password
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  res.json({ message: "Password successfully reset!" });
});

router.post("/changePassword", isAuthenticated, async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  // Validate input
  if (!currentPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({ message: "All fields are required." });
  }

  if (newPassword !== confirmPassword) {
    return res
      .status(400)
      .json({ message: "New password and confirm password do not match." });
  }

  try {
    const user = await User.findById(req.user.id); // Assuming the user's id is stored in the session or JWT

    // Check if the current password is correct
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Current password is incorrect." });
    }

    // Hash and set the new password
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password successfully changed." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;
