const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// REGISTER USER
const registerUser = async (req, res) => {

    try {

        const { name, email, password } = req.body;

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({
                message: "User already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            {
                expiresIn: "30d",
            }
        );

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token,
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

        const { email, password } = req.body;

        // check user
        const user = await User.findOne({ email });

        if (!user) {

            return res.status(401).json({
                message: "Invalid Email or Password",
            });

        }

        // compare password
        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {

            return res.status(401).json({
                message: "Invalid Email or Password",
            });

        }

        // generate token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            {
                expiresIn: "30d",
            }
        );

       res.status(200).json({
  _id: user._id,
  name: user.name,
  email: user.email,
  isAdmin: user.isAdmin,
  token,
});
        

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });

    }

};
const getUserProfile = async (req, res) => {

    res.status(200).json(req.user);

};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
};