import { Router } from "express";
import { signUpUser, loginUser, logout } from "../controllers/userController.js";
import { authCheck } from "../middleware/auth.js";

const route = Router();

// Login
route.post("/login", loginUser);

// Signup
route.post("/signup", signUpUser);

// Logout (Protected Route)
route.get("/logout", authCheck, logout);

export default route;
