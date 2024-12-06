import { Box, Grid, Grid2, Typography } from "@mui/material";
import { useApp } from "../../utils/useApp";
import DefaultImage from "../../../public/default.jpg";
import { useNavigate } from "react-router-dom";
import Loading from "../loading/Loading";
export default function PlayList() {
    const { playLists, pageLoading } = useApp();
    const navigate = useNavigate();

    const formatTimeAgo = (dateString: string): string => {
        const date: Date = new Date(dateString);
        const now: Date = new Date();
        const diffInSeconds: number = Math.floor((now.getTime() - date.getTime()) / 1000);

        const secondsInMinute = 60;
        const secondsInHour = secondsInMinute * 60;
        const secondsInDay = secondsInHour * 24;
        const secondsInWeek = secondsInDay * 7;
        const secondsInMonth = secondsInDay * 30;
        const secondsInYear = secondsInDay * 365;

        if (diffInSeconds < secondsInMinute) {
            return "just now";
        } else if (diffInSeconds < secondsInHour) {
            return `${Math.floor(diffInSeconds / secondsInMinute)} minutes ago`;
        } else if (diffInSeconds < secondsInDay) {
            return `${Math.floor(diffInSeconds / secondsInHour)} hours ago`;
        } else if (diffInSeconds < secondsInWeek) {
            return `${Math.floor(diffInSeconds / secondsInDay)} days ago`;
        } else if (diffInSeconds < secondsInMonth) {
            return `${Math.floor(diffInSeconds / secondsInWeek)} weeks ago`;
        } else if (diffInSeconds < secondsInYear) {
            return `${Math.floor(diffInSeconds / secondsInMonth)} months ago`;
        } else if (diffInSeconds < secondsInYear * 5) {
            return `${Math.floor(diffInSeconds / secondsInYear)} years ago`;
        } else {
            return "long time ago";
        }
    }
    return (
        <div className="playlist-container-dashboard">
            <Typography variant="h5" sx={{ my: 2 }}>
                Playlists
            </Typography>
            {!pageLoading && playLists.length > 0 && (
                <Grid2 container spacing={3}>
                    {playLists.map((playlist, index) => (
                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                            key={index}
                            onClick={() => navigate(`/playlist/${playlist._id}`)}
                        >
                            <Box className="playlist-grid">
                                <img
                                    src={playlist.songs[0]?.image || DefaultImage}
                                    alt={playlist.name}
                                    className="playlist-image-dashboard"
                                />
                                <Typography className="playlist-title-card">
                                    {playlist.name}
                                </Typography>
                                <Typography >
                                    Updated {formatTimeAgo(playlist.updatedAt)}
                                </Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid2>
            )}
            {!pageLoading && playLists.length === 0 && <Typography variant="h5" className="centered-bold-box">
                You currently don't have any playlist, press the + icon to create one
            </Typography>}
            {pageLoading && playLists.length === 0 && <Typography variant="h5" className="centered-bold-box">
                <Loading />
            </Typography>}
        </div>
    )
}
