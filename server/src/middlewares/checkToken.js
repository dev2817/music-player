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

    console.log("token", token);
    next();
  } catch (err) {
    console.log(err);
    return {
      message: err,
      success: false,
    };
  }
};
