import { Box, Grid2, Typography } from "@mui/material";
import { useApp } from "../../utils/useApp";
import DefaultImage from "../../../public/default.jpg";
import { useNavigate } from "react-router-dom";
export default function PlayList() {
    const { playLists } = useApp();
    const navigate = useNavigate();
    return (
        <div>
            <Typography variant="h5">Playlists
            </Typography>
            {
                playLists.length > 0 && (
                    <Grid2 container spacing={3} sx={{ mt: 2 }}>
                        {playLists.map((playlist: any, index: number) => (
                            <Grid2 onClick={() => { navigate(`/playlist/${playlist._id}`) }} item xs={12} sm={6} md={4} key={index}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: "10px",
                                    }}
                                >
                                    <img
                                        src={playlist.songs[0]?.image || DefaultImage}
                                        alt={playlist.name}
                                        style={{ height: "150px", width: "150px", borderRadius: "15px" }}
                                    />
                                    <Typography>{playlist.name}</Typography>
                                </Box>
                            </Grid2>
                        ))}
                    </Grid2>
                )
            }
        </div>
    )
}
