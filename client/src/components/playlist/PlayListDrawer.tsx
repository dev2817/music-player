import { Box, Button, Drawer, IconButton, TextField, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import Close from '@mui/icons-material/Close';
import { useState } from "react";
import { musicApi } from "../../api/apis";
import toast from "react-hot-toast";
import { useApp } from "../../utils/useApp";
import DefaultImage from "../../../public/default.jpg"
import "./PlayList.css"

export default function PlayListDrawer() {
    const [playListName, setPlayListName] = useState<string>("")
    const { isOpen, playLists, song, getPlayLists, setIsOpen } = useApp();
    const createPlayList = async () => {
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
                            onChange={(e) => setPlayListName(e.target.value)}
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
