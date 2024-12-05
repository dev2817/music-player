import bcrypt from "bcryptjs"
import { User } from "../models/user.model.js";
import jwt from 'jsonwebtoken'

const jwtSecret = process.env.JWT_SECRET;

const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return { data: hashedPassword, success: true, message: "hashed password successfully!" };
  }
  catch (err) {
    console.log("Error hashing password:", err);
    return { success: false, message: "Error saving password!" };
  }
}

const generateJwtToken = async (payload) => {
  try {
    const token = jwt.sign(payload, jwtSecret, { expiresIn: '1d' });
    return { data: token, success: true, message: "Token generated successfully" }
  }
  catch (err) {
    console.log("Error generating token:", err);
    return { message: `Error generating token`, success: false };
  }
}

const checkEmailExists = async (email) => {
  try {
    const user = await User.findOne({ email })
    if (user) {
      return {
        message: "User with email exists",
        data: user,
        success: true
      }
    }
    return {
      message: "No user Found!",
      success: false
    }
  }
  catch (err) {
    console.log(err)
    return {
      message: "Error finding user!",
      success: false
    }
  }
}

const signUpUser = async (data) => {
  try {
    const checkEmail = await checkEmailExists(data.email);
    if (!checkEmail.success) {
      const newPassword = await hashPassword(data.password)
      const userData = {
        name: data.name,
        email: data.email,
        password: newPassword.data
      }
      const user = await User.create(userData)
      if (user) {
        return {
          message: "User created successFully!",
          success: true,
          data: user
        }
      }
      return {
        message: "Failed to create user!",
        success: false
      }
    }
    return checkEmail
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: err,
    };
  }
};

const signInUser = async (data) => {
  try {
    const userExists = await checkEmailExists(data.email)
    if (userExists.success) {
      const isPasswordValid = await bcrypt.compare(data.password, userExists?.data?.password || '');
      if (!isPasswordValid) {
        return { message: "Invalid password.", success: false };
      }
      const createJwt = await generateJwtToken({ userId: userExists.data._id })
      if (createJwt.success) {
        return {
          message: "User logged in successfully!",
          success: true,
          data: createJwt.data
        }
      }
      return createJwt;
    }
    return userExists;
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: err,
    };
  }
};

const getUserById = async (id) => {
  try {
    const user = await User.findById(id);
    if (user) {
      return {
        message: "Got user successfully!",
        success: true,
        data: user
      }
    }
    return {
      message: "Failed to get User!",
      success: false
    }
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: err,
    };
  }
};

export const userService = {
  signUpUser,
  signInUser,
  getUserById,
};
