import passwordModel from "../models/passModal.js";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

const algorithm = "aes-256-cbc";

if (!process.env.ENCRYPTION_SECRET_KEY || !process.env.ENCRYPTION_IV) {
  throw new Error(
    "Missing ENCRYPTION_SECRET_KEY or ENCRYPTION_IV in .env file"
  );
}

const secretKey = Buffer.from(process.env.ENCRYPTION_SECRET_KEY, "hex");
const iv = Buffer.from(process.env.ENCRYPTION_IV, "hex");

// Encrypt Password
export const encryptPassword = (password) => {
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  let encrypted = cipher.update(password, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
};

// Decrypt Password
export const decryptPassword = (encryptedPassword) => {
  const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
  let decrypted = decipher.update(encryptedPassword, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};

// Fetch all passwords (decrypt before sending)
export const getpassword = async (req, res) => {
  const userId = req.user?._id;
  try {
    const allPasswords = await passwordModel.find({ author: userId });

    const decryptedPasswords = allPasswords.map((entry) => ({
      ...entry._doc,
      password: decryptPassword(entry.password),
    }));

    return res.status(200).json({
      success: true,
      data: decryptedPasswords,
      message: "Fetched all passwords successfully",
    });
  } catch (error) {
    console.error("Error fetching passwords:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// Store password (encrypt before saving)
export const postPassword = async (req, res) => {
  const userId = req.user?._id;
  const { title, password } = req.body;

  try {
    if (!title || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill all fields" });
    }

    const encryptedPassword = encryptPassword(password);

    const newPassword = new passwordModel({
      title,
      password: encryptedPassword,
      author: userId,
    });

    await newPassword.save();

    const allPasswords = await passwordModel.find({ author: userId });

    const decryptedPasswords = allPasswords.map((entry) => ({
      ...entry._doc,
      password: decryptPassword(entry.password),
    }));

    return res.status(201).json({
      success: true,
      data: decryptedPasswords,
      message: "Password saved successfully",
    });
  } catch (error) {
    console.error("Error saving password:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// Delete a password
export const deletePassword = async (req, res) => {
  const userId = req.user?._id;
  const passwordId = req.params.id;

  try {
    const deletedPassword = await passwordModel.findOneAndDelete({
      _id: passwordId,
      author: userId,
    });

    if (!deletedPassword) {
      return res
        .status(404)
        .json({ success: false, message: "Password not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Password deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting password:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// Update password (encrypt before saving)
export const updatePassword = async (req, res) => {
  const userId = req.user?._id;
  const passwordId = req.params.id;
  const { title, password } = req.body;

  try {
    if (!title || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill all fields" });
    }

    const encryptedPassword = encryptPassword(password);

    const updatedPassword = await passwordModel.findOneAndUpdate(
      { _id: passwordId, author: userId },
      { $set: { title, password: encryptedPassword } },
      { new: true }
    );

    if (!updatedPassword) {
      return res
        .status(404)
        .json({ success: false, message: "Password not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Error updating password:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
