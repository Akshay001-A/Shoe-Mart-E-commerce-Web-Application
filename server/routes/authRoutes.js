const express = require("express");

const router = express.Router();

const User = require("../models/User");

const { protect } = require("../middleware/authMiddleware");

const {
  registerUser,
  loginUser,
  getUserProfile,
} = require("../controllers/authController");

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/profile", protect, getUserProfile);

router.put("/admin", async (req, res) => {

  try {

    const user = await User.findOne({
      email: req.body.email,
    });

    if (user) {

      user.isAdmin = true;

      await user.save();

      res.json({
        message: "Admin Added Successfully",
      });

    } else {

      res.status(404).json({
        message: "User Not Found",
      });

    }

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

});

module.exports = router;