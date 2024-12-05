import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom"
import { musicApi } from "../../api/apis";
import DefaultImage from "../../../public/default.jpg"
import { Box, Typography } from "@mui/material";

export default function Playlist() {
    const { playListId } = useParams();
    const [playlist, setPlaylist] = useState<any>();
    const navigate = useNavigate();
    console.log(playlist);
    const getPlaylist = async () => {
        try {
            const response = await musicApi.getPlayListById(playListId as string)
            if (response.data.success) {
                setPlaylist(response.data.data)
                return;
            }
            toast.error(response.data.message);
            navigate('/dashboard')
            return
        }
        catch (err) {
            console.log(err);
            toast.error("Something went wrong!")
            navigate('/dashboard')
        }
    }

    useEffect(() => {
        getPlaylist()
    }, [playListId])
    return (
        <div>
            <img src={playlist?.songs[0]?.image || DefaultImage} alt="" style={{ height: "350px", width: "100%" }} />
            <Box sx={{ px: 5 }}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>{playlist?.name}</Typography>
                <Box>
                    {
                        playlist?.songs?.length > 0 && playlist?.songs?.map((song: any) => (
                            <Box sx={{ display: "flex", gap: "10px", mt: 1, width: "100%", maxWidth: "800px" }}>
                                <img src={song.image} alt="" style={{ height: "150px", width: "150px", borderRadius: "15px" }} />
                                <Box sx={{ display: "flex", flexDirection: "column", gap: "5px", justifyContent: "center" }}>
                                    <Typography variant="h6">{song?.name}
                                    </Typography>
                                    <Typography variant="body1">{song?.albumName}
                                    </Typography>
                                    <Typography variant="body1">{song?.releaseDate}
                                    </Typography>
                                </Box>
                            </Box>
                        ))
                    }
                </Box>
            </Box>
        </div>
    )
}
