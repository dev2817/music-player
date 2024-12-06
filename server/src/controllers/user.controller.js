import { userService } from "../services/user.service.js";

const signUpUser = async (req, res) => {
  try {
    const response = await userService.signUpUser(req.body);
    res.send(response);
    return;
  } catch (err) {
    console.log(err);
    return res.send({
      success: false,
      message: err,
    });
  }
};

const signInUser = async (req, res) => {
  try {
    const response = await userService.signInUser(req.body);
    res.send(response);
    return;
  } catch (err) {
    console.log(err);
    return res.send({
      success: false,
      message: err,
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const response = await userService.getUserById(req.user.userId);
    res.send(response);
    return;
  } catch (err) {
    console.log(err);
    return res.send({
      success: false,
      message: err,
    });
  }
};

export const userController = {
  signInUser,
  signUpUser,
  getUserById,
};
