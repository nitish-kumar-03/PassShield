import jwt from "jsonwebtoken";

export const authCheck = async (req, res, next) => {
  try {
    const token = req.headers["auth-token"];

    if (!token) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    const decodedValue = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decodedValue;
    
    next();
  } catch (error) {
    console.error("Auth Error:", error.message);
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
};
