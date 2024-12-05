import { IconButton, InputAdornment, TextField } from "@mui/material";
import { searchSpotifySongs } from "../../api/apis";
import { useCallback, useEffect, useState } from "react";
import { useApp } from "../../utils/useApp";
import SearchIcon from '@mui/icons-material/Search';
import Close from '@mui/icons-material/Close';
import debounce from "lodash/debounce";
import "./SearchBar.css"
import AddIcon from '@mui/icons-material/Add';
import PlayListDrawer from "../playlist/PlayListDrawer";

export default function SearchBar() {
    const { spotifyToken, setResults, setIsOpen, isVisible, toggleSearch } = useApp();
    const [query, setQuery] = useState("");

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
            <IconButton onClick={() => { setIsOpen({ open: true, type: "create" }) }} >
                <AddIcon />
            </IconButton>

            <PlayListDrawer />
        </div>
    )
}
