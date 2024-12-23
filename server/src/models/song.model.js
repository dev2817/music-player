import mongoose from "mongoose";
const Schema = mongoose.Schema;

const songSchema = new Schema(
  {
    songId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    albumName: {
      type: String,
      required: true,
    },
    releaseDate: {
      type: String,
      required: true,
    },
    artistNames: {
      type: [String],
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    playbackUrl: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Song = mongoose.model("Song", songSchema);
