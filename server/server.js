import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import morgan from "morgan";

// Import Routes
import useRoute from "./routes/userRoute.js";
import passwordRoute from "./routes/passwordRoute.js";

const app = express();
let PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Fixed the issue here

// Route Middleware
app.use("/pwm/api/user", useRoute);
app.use("/pwm/api/password", passwordRoute);

// Database Connection
const DatabaseConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Database is connected");
  } catch (error) {
    console.error("Database connection error:", error);
  }
};

DatabaseConnection()
  .then(() => {
    // Start Server
    app.listen(PORT, () => {
      console.log(`Server is started on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Server Error : ", error);
  });
