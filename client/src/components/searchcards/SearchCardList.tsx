import { Typography } from "@mui/material";
import { useApp } from "../../utils/useApp"
import SearchCard from "./SearchCard";

export default function SearchCardList() {
    const { results } = useApp();
    return (
        <div className="box-h-w-100">
            <Typography variant="h5" sx={{ my: 2 }}>
                Search Results
            </Typography>
            {
                results.length > 0 && results.map((result) => (
                    <SearchCard result={result} />
                ))
            }
            {results.length === 0 && <Typography variant="h5" className="centered-bold-box">
                No results found. Try searching for a song!
            </Typography>}
        </div>
    )
}
