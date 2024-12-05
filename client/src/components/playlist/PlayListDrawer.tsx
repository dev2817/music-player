import { Box, Button, Drawer, IconButton, TextField, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import Close from '@mui/icons-material/Close';
import { useState } from "react";
import { musicApi } from "../../api/apis";
import toast from "react-hot-toast";
import { useApp } from "../../utils/useApp";
import DefaultImage from "../../../public/default.jpg"

export default function PlayListDrawer() {
    const [playListName, setPlayListName] = useState<string>("")
    const { isOpen, toggleDrawer, playLists, song, getPlayLists, setIsOpen } = useApp();
    const createPlayList = async () => {
        try {
            const playlist = await musicApi.createPlayList({ name: playListName })
            if (playlist.data.success) {
                toast.success("Playlist created successfully!")
                console.log(playlist.data.data);
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
            onClose={toggleDrawer(false, "create")}
        >
            <Box
                sx={{
                    height: 250,
                    padding: 2,
                    backgroundColor: "white",
                    position: "relative"
                }}
                role="presentation"
            >
                <IconButton sx={{ position: 'absolute', zIndex: 10, right: "25px", top: "10px" }} onClick={() => { toggleDrawer(false, "create") }}><Close /></IconButton>
                {isOpen.type === "create" ? <Box sx={{ display: 'flex', flexDirection: 'column', gap: "10px", px: 2, alignItems: "center", justifyContent: "center" }}>
                    <Typography variant="h5">
                        Create Playlist
                    </Typography>
                    <TextField
                        variant="outlined"
                        fullWidth
                        name="name"
                        label="Name"
                        value={playListName}
                        onChange={(e) => { setPlayListName(e.target.value) }}
                    />
                    <Button fullWidth onClick={() => { createPlayList() }} variant="contained"><AddIcon /> Create</Button>
                </Box> :
                    <Box sx={{ width: "100%" }}>
                        {
                            playLists.length > 0 && playLists.map((playlist) => (
                                <Box sx={{ display: "flex", gap: '10px', mt: 1, width: "100%" }}>
                                    <img src={playlist?.songs[0]?.url || DefaultImage} alt="" style={{ height: "100px", width: "100px", borderRadius: "15px" }} />
                                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "80%" }}>
                                        <Typography variant="body1" sx={{ fontSize: "18px", fontWeight: "600" }}>{playlist?.name}</Typography>
                                        <IconButton onClick={() => { addSongToPlaylist(playlist?._id) }}><AddIcon /></IconButton>
                                    </Box>
                                </Box>
                            ))
                        }
                    </Box>
                }
            </Box>
        </Drawer>
    )
}
