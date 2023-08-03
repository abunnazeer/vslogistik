const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/"); // Destination folder
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname); // Generating unique file name
  },
});
const fileFilter = (req, file, cb) => {
  // Reject a file
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,

  limits: {
    fileSize: 1024 * 1024 * 5, // limiting files size to 5MB
  },
});

router.post(
  "/profile",
  isAuthenticated,
  upload.single("profilePicture"),
  async (req, res) => {
    try {
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        return res.status(400).json({ message: "Profile already exists." });
      }

      profile = new Profile({
        user: req.user.id,
        ...req.body, // destructuring to capture all body params into the profile object.
      });

      await profile.save();
      res.json(profile);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error." });
    }
  }
);

router.get("/profile", isAuthenticated, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found." });
    }
    res.json(profile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
});

router.get("/profile", isAuthenticated, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found." });
    }
    res.json(profile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
});

router.put(
  "/profile",
  isAuthenticated,
  upload.single("profilePicture"),
  async (req, res) => {
    try {
      let profile = await Profile.findOne({ user: req.user.id });
      if (!profile) {
        return res.status(404).json({ message: "Profile not found." });
      }

      // Update fields
      Object.assign(profile, req.body);

      await profile.save();
      res.json(profile);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error." });
    }
  }
);
router.delete("/profile", isAuthenticated, async (req, res) => {
  try {
    await Profile.findOneAndDelete({ user: req.user.id });
    res.json({ message: "Profile deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
});
