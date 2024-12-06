import { Box, IconButton, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { useApp } from "../../utils/useApp";
import "./SearchCard.css"

export default function SearchCard({ result }: { result: any }) {
    const { setSong, setIsOpen } = useApp();
    const handleSetSong = () => {
        setSong({
            songId: result.id,
            name: result.name,
            albumName: result?.album?.name ?? "Unknown Album",
            image: result?.album?.images?.[0]?.url,
            releaseDate: result?.album?.release_date ?? "Unknown Date",
            playbackUrl: result?.album?.uri ?? "No Playback URL",
            artistNames: result?.artists?.map((artist: { name: string }) => artist.name) ?? ["Unknown Artist"]
        });
        setIsOpen({ open: true, type: "add" })
    }

    return (
        <Box className="search-bar-component">
            <img
                src={result?.album?.images[0].url}
                alt={result.name}
                className="search-bar-component-image"
            />
            <Box className="search-bar-component-details">
                <Box className="search-bar-component-info">
                    <Typography variant="h6">{result?.name}</Typography>
                    <Typography variant="body1">{result?.album?.name}</Typography>
                    <Typography variant="body1">{result?.album?.release_date}</Typography>
                    <Box className="search-bar-component-artists">
                        {result?.album?.artists.map((artist: any, index: number) => (
                            <p key={index}>
                                {artist?.name}
                                {index < result.album.artists.length - 1 ? `,` : ""}
                                &nbsp;
                            </p>
                        ))}
                    </Box>
                </Box>
                <IconButton
                    disableRipple
                    className="search-bar-component-icon-button"
                    onClick={() => {
                        handleSetSong();
                    }}
                >
                    <AddIcon />
                </IconButton>
            </Box>
        </Box>
    )
}
