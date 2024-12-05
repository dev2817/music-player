import { useApp } from "../../utils/useApp"
import SearchCard from "./SearchCard";

export default function SearchCardList() {
    const { results } = useApp();
    return (
        <div>
            {
                results.length > 0 && results.map((result) => (
                    <SearchCard result={result} />
                ))
            }
        </div>
    )
}
