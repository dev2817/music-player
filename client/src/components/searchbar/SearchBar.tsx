import { Box, Button, Drawer, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import { searchSpotifySongs } from "../../api/apis";
import { useCallback, useEffect, useState } from "react";
import { useApp } from "../../utils/useApp";
import SearchIcon from '@mui/icons-material/Search';
import Close from '@mui/icons-material/Close';
import debounce from "lodash/debounce";
import "./SearchBar.css"
import AddIcon from '@mui/icons-material/Add';

export default function SearchBar() {
    const { spotifyToken, setResults } = useApp();
    const [query, setQuery] = useState("");
    const [isVisible, setIsVisible] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
        if (event.type === "keydown" && ((event as React.KeyboardEvent).key === "Tab" || (event as React.KeyboardEvent).key === "Shift")) {
            return;
        }
        setIsOpen(open);
    };

    const toggleSearch = () => {
        setIsVisible((prev) => !prev);
    };

    const debouncedSearch = useCallback(
        debounce(async (searchQuery: string) => {
            try {
                if (searchQuery.trim()) {
                    const searchResults = await searchSpotifySongs(searchQuery, spotifyToken);
                    setResults(searchResults.tracks);
                }
            } catch (error) {
                console.error(error);
            }
        }, 450),
        [spotifyToken, searchSpotifySongs]
    );

    useEffect(() => {
        debouncedSearch(query);
        return () => debouncedSearch.cancel();
    }, [query, debouncedSearch]);


    return (
        <div className="search-container">
            <div className={`search-div ${isVisible ? "visible" : "hidden"}`}>
                <TextField
                    placeholder="Search a song"
                    type="text"
                    value={query}
                    fullWidth
                    onChange={(e) => setQuery(e.target.value)}
                    InputProps={{
                        endAdornment: (
                            <>
                                <InputAdornment position="end">
                                    <SearchIcon />
                                </InputAdornment>
                            </>
                        ),
                    }}
                />
            </div>
            <IconButton onClick={toggleSearch}>
                {isVisible ? <Close /> : <SearchIcon />}
            </IconButton>
            <IconButton onClick={() => setIsOpen(true)} >
                <AddIcon />
            </IconButton>

            <Drawer
                anchor="bottom"
                open={isOpen}
                onClose={toggleDrawer(false)}
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
                    <IconButton sx={{ position: 'absolute', zIndex: 10, right: "25px", top: "10px" }} onClick={toggleDrawer(false)}><Close /></IconButton>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: "10px", px: 2, alignItems: "center", justifyContent: "center" }}>
                        <Typography variant="h5">
                            Create Playlist
                        </Typography>
                        <TextField
                            variant="outlined"
                            fullWidth
                            name="name"
                            label="Name"
                        />
                        <Button fullWidth variant="contained"><AddIcon /> Create</Button>
                    </Box>
                </Box>
            </Drawer>
        </div>
    )
}
