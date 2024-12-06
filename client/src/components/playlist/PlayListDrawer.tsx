import { Box, Button, Drawer, IconButton, TextField, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import Close from '@mui/icons-material/Close';
import { useState } from "react";
import { musicApi } from "../../api/apis";
import toast from "react-hot-toast";
import { useApp } from "../../utils/useApp";
import DefaultImage from "../../../public/default.jpg"
import "./PlayList.css"
import Joi from 'joi'

const playListSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(50)
        .required()
        .messages({
            "string.empty": "Playlist name is required",
            "string.min": "Playlist name must be at least 3 characters long",
            "string.max": "Playlist name must not exceed 50 characters",
        }),
});
export default function PlayListDrawer() {
    const [playListName, setPlayListName] = useState<string>("")
    const { isOpen, playLists, song, getPlayLists, setIsOpen } = useApp();
    const [error, setError] = useState<string | null>(null);

    const validatePlayListName = (name: string): string | null => {
        const { error } = playListSchema.validate({ name });
        return error ? error.details[0].message : null;
    };


    const createPlayList = async () => {
        const error = validatePlayListName(playListName);
        if (error) {
            toast.error(error);
            return;
        }

        try {
            const playlist = await musicApi.createPlayList({ name: playListName })
            if (playlist.data.success) {
                toast.success("Playlist created successfully!")
                await getPlayLists()
                setIsOpen({ open: false, type: "create" })
                return;
            }
            toast.error(playlist.data.message)
        }
        catch (err) {
            console.log(err);
            toast.error("Something went wrong!")
        }
    }

    const addSongToPlaylist = async (playlistId: string) => {
        try {
            const response = await musicApi.updatePlayList(playlistId, {
                song
            })
            if (response.data.success) {
                toast.success("Added song to the playlist!")
                return;
            }
            toast.error(response.data.message)
            return;
        }
        catch (err) {
            console.log(err);
            toast.error("Something went wrong!")
        }
    }
    return (
        <Drawer
            anchor="bottom"
            open={isOpen.open}
            onClose={() => setIsOpen({ open: false, type: "create" })}
        >
            <Box className="drawer-container" role="presentation">
                <Close
                    className="drawer-close-icon"
                    onClick={() => setIsOpen({ open: false, type: "create" })} />

                {isOpen.type === "create" ? (
                    <Box className="create-container">
                        <Typography variant="h5">Create Playlist</Typography>
                        <TextField
                            variant="outlined"
                            fullWidth
                            name="name"
                            label="Name"
                            value={playListName}
                            onChange={(e) => {
                                const value = e.target.value;
                                setPlayListName(value);
                                setError(validatePlayListName(value));
                            }}
                            error={!!error}
                            helperText={error}
                        />

                        <Button fullWidth onClick={createPlayList} variant="contained">
                            <AddIcon /> Create
                        </Button>
                    </Box>
                ) : (
                    <Box sx={{ width: "100%" }}>
                        {playLists.length > 0 &&
                            playLists.map((playlist) => (
                                <Box className="playlist-container-drawer" key={playlist._id}>
                                    <img
                                        src={playlist?.songs[0]?.url || DefaultImage}
                                        alt=""
                                        className="playlist-image-drawer"
                                    />
                                    <Box className="playlist-content-drawer">
                                        <Typography
                                            variant="body1"
                                            className="playlist-title"
                                        >
                                            {playlist?.name}
                                        </Typography>
                                        <IconButton onClick={() => addSongToPlaylist(playlist._id)}>
                                            <AddIcon />
                                        </IconButton>
                                    </Box>
                                </Box>
                            ))}
                    </Box>
                )}
            </Box>
        </Drawer>
    )
}
