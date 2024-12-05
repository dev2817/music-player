import express from "express";
import { userController } from "../controllers/user.controller.js";
import { musicController } from "../controllers/music.controller.js";
import { checkToken } from "../middlewares/checkToken.js";

const router = express.Router();

//test route
router.get("/test", (req, res) => {
  res.send({
    message: "Server is up and running!",
    success: true,
  });
});

//user routes
router.post("/signUp", userController.signUpUser);

router.post("/signIn", userController.signInUser);

router.get("/getUserById/:userId", checkToken, userController.getUserById);

//music routes
router.post("/createPlayList", checkToken, musicController.createPlayList);

router.get(
  "/getPlayListById/:playListId",
  checkToken,
  musicController.getPlayListById
);

router.get(
  "/getPlayListByUserId",
  checkToken,
  musicController.getPlayListByUserId
);

router.put(
  "/updatePlayList/:playListId",
  checkToken,
  musicController.updatePlayList
);

router.delete(
  "/deletePlayList/:playListId",
  checkToken,
  musicController.deletePlayList
);

export default router;
