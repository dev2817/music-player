import { useEffect } from "react";
import PlayList from "../../components/playlist/PlayList";
import SearchBar from "../../components/searchbar/SearchBar";
import { useApp } from "../../utils/useApp"
import SearchCardList from "../../components/searchcards/SearchCardList";
export default function Dashboard() {
    const { getPlayLists, isVisible } = useApp()

    useEffect(() => {
        getPlayLists()
    }, [])
    return (
        <div>
            <SearchBar />
            {isVisible ? <SearchCardList /> :
                <PlayList />
            }
        </div>
    )
}
