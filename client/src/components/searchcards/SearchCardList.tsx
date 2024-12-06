import { Typography } from "@mui/material";
import { useApp } from "../../utils/useApp"
import SearchCard from "./SearchCard";
import Loading from "../loading/Loading";

export default function SearchCardList() {
    const { results, pageLoading } = useApp();
    return (
        <div className="box-h-w-100">
            <Typography variant="h5" sx={{ my: 2 }}>
                Search Results
            </Typography>
            {
                !pageLoading && results.length > 0 && results.map((result) => (
                    <SearchCard result={result} />
                ))
            }
            {results.length === 0 && !pageLoading && <Typography variant="h5" className="centered-bold-box">
                No results found. Try searching for a song!
            </Typography>}
            {results.length === 0 && pageLoading && <Typography variant="h5" className="centered-bold-box">
                <Loading />
            </Typography>}
        </div>
    )
}
