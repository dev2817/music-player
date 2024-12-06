import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET;

export const checkToken = async (req, res, next) => {
  try {
    const token = req?.headers?.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).send({
        message: "No token provided, please provide a token",
        success: false,
      });
    }

    try {
      const decoded = await jwt.verify(token, jwtSecret);
      req.user = decoded;
      return next();
    } catch (err) {
      return res.status(401).send({
        success: false,
        message: "Invalid token",
        signOut: true,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      message: "Error verifying token",
      success: false,
      signOut: true,
    });
  }
};
