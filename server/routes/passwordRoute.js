import { Router } from "express";
import { authCheck } from "../middleware/auth.js";
import {
  deletePassword,
  getpassword,
  postPassword,
  updatePassword,
} from "../controllers/passwordController.js";

const route = Router();

// Get password
route.get("/getpassword", authCheck, getpassword);

// Post password
route.post("/postpassword", authCheck, postPassword);

// Delete password
route.delete("/deletepassword/:id", authCheck, deletePassword);

// Update password
route.put("/updatepassword/:id", authCheck, updatePassword);

export default route;
