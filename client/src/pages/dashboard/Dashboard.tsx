import { useEffect } from "react";
import PlayList from "../../components/playlist/PlayList";
import SearchBar from "../../components/searchbar/SearchBar";
import { useApp } from "../../utils/useApp"
import SearchCardList from "../../components/searchcards/SearchCardList";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { authApi } from "../../api/apis";
export default function Dashboard() {
    const { getPlayLists, isVisible, setUser } = useApp()
    const navigate = useNavigate();
    useEffect(() => {
        getPlayLists()
    }, [])

    const getUserDetails = async () => {
        try {
            const response = await authApi.getUserById();
            if (response.data.success) {
                setUser(response.data.data)
                return;
            }
            toast.error(response.data.message)
        }
        catch (err) {
            console.log(err);
            toast.error("Something went wrong!")
        }
    }

    useEffect(() => {
        getUserDetails()
        const token = localStorage.getItem("authToken");
        if (!token) {
            localStorage.clear();
            navigate('/sign-in')
            window.location.reload()
        }
    }, [])
    return (
        <div style={{ height: "100%", width: "100%" }}>
            <SearchBar />
            {isVisible ? <SearchCardList /> :
                <PlayList />
            }
        </div>
    )
}
