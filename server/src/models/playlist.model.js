import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const playlistSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    songs: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Song',
        },
    ],
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
});

export const Playlist = mongoose.model('Playlist', playlistSchema);
