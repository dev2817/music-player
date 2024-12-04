import { musicService } from "../services/music.service.js";

const getPlayListByUserId = async (req, res) => {
  try {
    const response = await musicService.getPlayListByUserId(req.params.userId);
    res.send(response);
    return;
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: err,
    };
  }
};

const getPlayListById = async (req, res) => {
  try {
    const response = await musicService.getPlayListById(req.params.playListId);
    res.send(response);
    return;
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: err,
    };
  }
};

const createPlayList = async (req, res) => {
  try {
    const response = await musicService.createPlayList(req.body);
    res.send(response);
    return;
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: err,
    };
  }
};

const updatePlayList = async (req, res) => {
  try {
    const response = await musicService.updatePlayList(
      req.params.playListId,
      req.body
    );
    res.send(response);
    return;
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: err,
    };
  }
};

const deletePlayList = async (req, res) => {
  try {
    const response = await musicService.deletePlayList(req.params.playListId);
    res.send(response);
    return;
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: err,
    };
  }
};

export const musicController = {
  createPlayList,
  getPlayListById,
  getPlayListByUserId,
  updatePlayList,
  deletePlayList,
};
