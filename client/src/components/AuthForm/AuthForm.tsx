import { useState } from "react";
import { useApp } from "../../utils/useApp";
import { searchSpotifySongs } from "../../api/apis";
import { Link } from "react-router-dom";

type TAuthForm = {
    type: 'sign-up' | 'sign-in'
}

export default function AuthForm({ type }: TAuthForm) {
    const { spotifyToken } = useApp();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);
    console.log(results);

    const handleSearch = async () => {
        try {
            const searchResults = await searchSpotifySongs(query, spotifyToken);
            setResults(searchResults.tracks);
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <div>
            <div>{type === "sign-in" ? "Sign In" : "Sign Up"}</div>

            <div>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for songs"
                />
                <button onClick={handleSearch}>Search</button>
                <ul>
                    {results.map((track) => (
                        <Link target="_blank" to={track.album.uri}>
                            <li key={track.id}>
                                <strong>{track.name}</strong> by{" "}
                                {track.artists.map((artist) => artist.name).join(", ")}
                            </li>
                        </Link>

                    ))}
                </ul>
            </div>
        </div>
    )
}
