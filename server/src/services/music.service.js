import { Playlist } from "../models/playlist.model.js";
import { User } from "../models/user.model.js";
import { Song } from "../models/song.model.js";

const addSong = async (song) => {
  try {
    const songExists = await Song.findOne({ songId: song.songId });
    if (songExists) {
      return {
        message: "Song already Exists!",
        success: true,
        data: songExists,
      };
    }
    const newSong = await Song.create(song);
    if (newSong) {
      return {
        message: "Song created Successfully!",
        data: newSong,
        success: true,
      };
    }
    return {
      message: "Failed to create song!",
      success: false,
    };
  } catch (err) {
    console.log(err);
    return {
      message: err,
      success: false,
    };
  }
};

const getPlayListByUserId = async (userId) => {
  try {
    const playlists = await Playlist.find({ userId, isActive: true }).populate("songs");
    if (playlists) {
      return {
        message: "Got playlists successfully!",
        success: true,
        data: playlists,
      };
    }
    return {
      message: "No playlist found!",
      success: false,
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: err,
    };
  }
};

const getPlayListById = async (playlistId) => {
  try {
    const playlist = await Playlist.findOne({
      _id: playlistId,
      isActive: true,
    }).populate("songs");

    if (playlist) {
      return {
        message: "Got playlist successfully!",
        success: true,
        data: playlist,
      };
    }
    return {
      message: "No playlist found!",
      success: false,
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: err,
    };
  }
};

const createPlayList = async (userId, data) => {
  try {
    const userExists = await User.findById(userId);
    if (userExists) {
      const playlist = await Playlist.create({
        name: data.name,
        userId: userExists._id,
      });
      if (playlist) {
        return {
          message: "Playlist created successfully!",
          success: true,
          data: playlist,
        };
      }
      return {
        message: "Error creating playlist!",
        success: false,
      };
    }
    return {
      message: "User not found!",
      success: false,
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: err,
    };
  }
};

const updatePlayList = async (playListId, data) => {
  try {
    const playlistExists = await Playlist.findById(playListId);
    if (!playlistExists) {
      return {
        message: "Playlist not found!",
        success: false,
      };
    }

    let updatedSongs = [...playlistExists.songs.map((song) => song.toString())];

    if (Array.isArray(data.songs)) {
      updatedSongs = [...new Set(data.songs.map((song) => song.toString()))];
    } else if (data.song) {
      const checkSong = await addSong(data.song);
      if (checkSong?.success && checkSong.data?._id) {
        const newSongId = checkSong.data._id.toString();
        if (!updatedSongs.includes(newSongId)) {
          updatedSongs.push(newSongId);
        }
      } else {
        return {
          message: "Failed to add song to playlist.",
          success: false,
        };
      }
    }

    const updatedPlaylistData = {
      name: data.name || playlistExists.name,
      songs: updatedSongs,
    };

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
      playListId,
      updatedPlaylistData,
      { new: true }
    ).populate("songs");

    if (updatedPlaylist) {
      return {
        message: "Playlist updated successfully!",
        success: true,
        data: updatedPlaylist,
      };
    }

    return {
      message: "Error updating playlist!",
      success: false,
    };
  } catch (err) {
    console.error("Error updating playlist:", err);
    return {
      success: false,
      message: err.message || "An unexpected error occurred.",
    };
  }
};


const deletePlayList = async (playListId) => {
  try {
    const playlistExists = await Playlist.findById(playListId);
    if (!playlistExists) {
      return {
        message: "Playlist not found!",
        success: false,
      };
    }
    const updatedPlaylist = await Playlist.findByIdAndUpdate(
      playListId,
      { $set: { isActive: false } },
      { new: true }
    );
    if (updatedPlaylist) {
      return {
        message: "Playlist deleted successfully!",
        success: true,
        data: updatedPlaylist,
      };
    }

    return {
      message: "Error deleting playlist!",
      success: false,
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: err,
    };
  }
};

export const musicService = {
  getPlayListById,
  getPlayListByUserId,
  createPlayList,
  updatePlayList,
  deletePlayList,
};
