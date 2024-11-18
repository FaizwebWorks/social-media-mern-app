import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ message: "You are not authenticated", success: false });
    }

    const decoded = await jwt.verify(token, process.env.SECRET_KEY);
    if (!decoded) {
      return res.status(401).json({
        message: "Invalid",
        success: false,
      });
    }
    req.id = decoded.userId;
    next();
  } catch (error) {
    console.log("Middleware => ", error.message);
  }
};

export default isAuthenticated;
