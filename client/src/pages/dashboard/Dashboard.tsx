import PlayList from "../../components/playlist/PlayList";
import SearchBar from "../../components/searchbar/SearchBar";

export default function Dashboard() {
    return (
        <div>
            <SearchBar />
            <PlayList />
            {/* <SearchCardList /> */}
        </div>
    )
}
