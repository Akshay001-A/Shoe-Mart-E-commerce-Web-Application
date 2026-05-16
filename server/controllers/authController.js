const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// GENERATE TOKEN
const generateToken = (id) => {

  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );

};


// REGISTER USER
const registerUser = async (req, res) => {

  try {

    const {
      name,
      email,
      password,
    } = req.body;

    const userExists = await User.findOne({
      email,
    });

    if (userExists) {

      return res.status(400).json({
        message: "User already exists",
      });

    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const user = await User.create({

      name,
      email,
      password: hashedPassword,

    });

    res.status(201).json({

      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      address: user.address,
      token: generateToken(user._id),

    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};


// LOGIN USER
const loginUser = async (req, res) => {

  try {

    const {
      email,
      password,
    } = req.body;

    const user = await User.findOne({
      email,
    });

    if (!user) {

      return res.status(401).json({
        message:
          "Invalid Email or Password",
      });

    }

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {

      return res.status(401).json({
        message:
          "Invalid Email or Password",
      });

    }

    res.status(200).json({

      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      address: user.address,
      token: generateToken(user._id),

    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};


// GET PROFILE
const getUserProfile = async (req, res) => {

  res.status(200).json(req.user);

};


// UPDATE PROFILE
const updateUserProfile = async (req, res) => {

  try {

    const user =
      await User.findById(req.user._id);

    if (!user) {

      return res.status(404).json({
        message: "User not found",
      });

    }

    user.name =
      req.body.name || user.name;

    user.email =
      req.body.email || user.email;

    user.address =
      req.body.address || user.address;

    // PASSWORD UPDATE
    if (
      req.body.password &&
      req.body.password.length >= 6
    ) {

      user.password =
        await bcrypt.hash(
          req.body.password,
          10
        );

    }

    const updatedUser =
      await user.save();

    res.status(200).json({

      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      address: updatedUser.address,
      token: generateToken(
        updatedUser._id
      ),

    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};


module.exports = {

  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,

};