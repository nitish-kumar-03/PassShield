import bcryptjs from "bcryptjs";
import userModal from "../models/userModal.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// Login User
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill all fields" });
    }

    // Check if user exists
    const existUser = await userModal.findOne({ email });
    if (!existUser) {
      return res
        .status(404)
        .json({ success: false, message: "User does not exist" });
    }

    // Compare password
    const isPasswordMatch = await bcryptjs.compare(
      password,
      existUser.password
    );
    if (!isPasswordMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Incorrect password" });
    }

    // Generate token
    const token = jwt.sign({ _id: existUser._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    console.log("Generated Token:", token); // Debugging line

    if (!token) {
      return res
        .status(500)
        .json({ success: false, message: "Token generation failed" });
    }

    // Update refresh token
    existUser.refreshToken = token;
    await existUser.save();

    return res.status(200).json({
      success: true,
      data: existUser,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// Sign Up User
export const signUpUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill all fields" });
    }

    // Check if user already exists
    const existUser = await userModal.findOne({ email });
    if (existUser) {
      return res
        .status(409)
        .json({ success: false, message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Create new user
    const newUser = new userModal({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // Generate token
    const token = jwt.sign({ _id: existUser._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    console.log("Generated Token:", token); // Debugging line

    if (!token) {
      return res
        .status(500)
        .json({ success: false, message: "Token generation failed" });
    }

    newUser.refreshToken = token;
    await newUser.save();

    return res.status(201).json({
      success: true,
      data: newUser,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("SignUp Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// Logout User
export const logout = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid request" });
    }

    await userModal.findByIdAndUpdate(userId, { $set: { refreshtoken: null } });

    return res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    console.error("Logout Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
