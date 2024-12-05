import { Box, IconButton, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';

export default function SearchCard({ result }: { result: any }) {
    console.log(result);
    return (
        <Box sx={{ display: "flex", gap: "10px", mt: 1, p: 1, width: "100%", maxWidth: "800px" }}>
            <img src={result?.album?.images[0].url} alt={result.name} style={{ height: "150px", width: "150px", borderRadius: "15px" }} />
            <Box sx={{ display: "flex", gap: '10px', justifyContent: "space-between", width: "100%", px: 2 }}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "left" }}>

                    <Typography variant="h6">{result?.name}
                    </Typography>
                    <Typography variant="body1">{result?.album?.name}
                    </Typography>
                    <Typography variant="body1">{result?.album?.release_date}
                    </Typography>
                    <Box sx={{ display: 'flex' }}>
                        {
                            result?.album?.artists.map((artist: any, index: number) => (
                                <p key={index}>
                                    {artist?.name}
                                    {index < result.album.artists.length - 1 ? `,` : ""}&nbsp;
                                </p>
                            ))
                        }

                    </Box>
                </Box>
                <IconButton>
                    <AddIcon />
                </IconButton>
            </Box>
        </Box>
    )
}
