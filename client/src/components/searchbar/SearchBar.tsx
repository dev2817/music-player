import { Box, Button, Drawer, IconButton, InputAdornment, Menu, MenuItem, TextField, Typography, useMediaQuery, useTheme } from "@mui/material";
import { searchSpotifySongs } from "../../api/apis";
import { useCallback, useEffect, useState } from "react";
import { useApp } from "../../utils/useApp";
import SearchIcon from '@mui/icons-material/Search';
import Close from '@mui/icons-material/Close';
import debounce from "lodash/debounce";
import "./SearchBar.css"
import AddIcon from '@mui/icons-material/Add';
import PlayListDrawer from "../playlist/PlayListDrawer";
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from "react-router-dom";
import DensityMediumIcon from '@mui/icons-material/DensityMedium';

export default function SearchBar() {
    const { spotifyToken, setResults, setIsOpen, isVisible, toggleSearch, setPageLoading, setIsVisible } = useApp();
    const [query, setQuery] = useState("");
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        localStorage.clear();
        navigate("/sign-in");
        window.location.reload();
    };

    const debouncedSearch = useCallback(
        debounce(async (searchQuery: string) => {
            try {
                if (searchQuery.trim()) {
                    const searchResults = await searchSpotifySongs(searchQuery, spotifyToken);
                    setResults(searchResults.tracks);
                    setPageLoading(false)
                }
            } catch (error) {
                console.error(error);
            }
        }, 450),
        [spotifyToken, searchSpotifySongs]
    );

    useEffect(() => {
        setPageLoading(true);
        debouncedSearch(query);
        return () => debouncedSearch.cancel();
    }, [query, debouncedSearch]);


    return (
        <div className="navbar-container">
            <Box className="nav-title-box">
                <Typography variant="h4" fontWeight={600}>
                    Playlister
                </Typography>
            </Box>

            <div className={`searchbar-container ${isVisible ? "searchbar-visible" : "searchbar-hidden"}`}>
                {!isMobile && (
                    <TextField
                        placeholder="Search a song"
                        type="text"
                        value={query}
                        fullWidth
                        onChange={(e) => setQuery(e.target.value)}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                )}
            </div>

            <Box className="mobile-nav-box">
                {!isMobile && (
                    <IconButton onClick={toggleSearch}>
                        {isVisible ? <Close /> : <SearchIcon />}
                    </IconButton>
                )}
                {!isMobile && (
                    <IconButton onClick={() => setIsOpen({ open: true, type: "create" })}>
                        <AddIcon />
                    </IconButton>
                )}
                {!isMobile && (
                    <IconButton onClick={handleClick}>
                        <PersonIcon />
                    </IconButton>
                )}
                {isMobile && (
                    <IconButton onClick={() => setDrawerOpen(true)}>
                        <DensityMediumIcon />
                    </IconButton>
                )}
                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "right",
                    }}
                    transformOrigin={{
                        vertical: "top",
                        horizontal: "right",
                    }}
                >
                    <MenuItem
                        onClick={() => {
                            handleClose();
                            handleLogout();
                        }}
                    >
                        Logout
                    </MenuItem>
                </Menu>
            </Box>

            <PlayListDrawer />

            <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                className="mobile-nav-drawer"
                sx={{
                    "& .MuiDrawer-paper": {
                        width: 250,
                        boxSizing: "border-box",
                    },
                }}
            >
                <Box className="search-bar-box">
                    <Close className="mobile-nav-drawer-close" onClick={() => setDrawerOpen(false)} />
                    <TextField
                        sx={{ pt: 4 }}
                        placeholder="Search a song"
                        type="text"
                        value={query}
                        fullWidth
                        onChange={(e) => { setQuery(e.target.value); setIsVisible(true) }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Box className="search-bar-icon-box">
                        <Button className="mobile-nav-buttons" onClick={() => setIsOpen({ open: true, type: "create" })}>
                            <AddIcon /> Create Playlist
                        </Button>
                        <Button className="mobile-nav-buttons" onClick={() => { handleLogout() }}>
                            <PersonIcon /> Log Out
                        </Button>
                    </Box>
                </Box>
            </Drawer>
        </div>
    )
}
