export const checkToken = async (req, res, next) => {
  try {
    const token = req?.headers?.authorization?.split(" ")[1];
    if (!token) {
      res.send({
        message: "No token provided, please provide a token",
        success: false,
      });
      return;
    }
    const decoded = jwt.verify(token, jwtSecret);
    if (decoded) {
      req.user = decoded;
      next();
    }
    res.send({ success: false, message: "Error verifying token", signOut: true })
  } catch (err) {
    console.log(err);
    return {
      message: err,
      success: false,
    };
  }
};
