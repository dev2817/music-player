import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { fetchSpotifyAccessToken, musicApi } from '../api/apis';
import toast from 'react-hot-toast';

type AppContextType = {
    user: any;
    setUser: React.Dispatch<React.SetStateAction<any | null>>;
    spotifyToken: string,
    setSpotifyToken: React.Dispatch<React.SetStateAction<string>>;
    song: string,
    setSong: React.Dispatch<React.SetStateAction<any>>;
    results: any[],
    setResults: React.Dispatch<React.SetStateAction<any[]>>;
    playLists: any[],
    getPlayLists: () => void
    isOpen: { open: boolean, type: "create" | "add" },
    setIsOpen: React.Dispatch<React.SetStateAction<{ open: boolean; type: "create" | "add" }>>;
    toggleDrawer: (open: boolean, type: "create" | "add") => (event: React.KeyboardEvent | React.MouseEvent) => void;
    isVisible: boolean,
    toggleSearch: () => void,
    pageLoading: boolean,
    setPageLoading: React.Dispatch<React.SetStateAction<boolean>>
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<any>();
    const [spotifyToken, setSpotifyToken] = useState<string>("");
    const [results, setResults] = useState<any[]>([]);
    const [playLists, setPlayLists] = useState([]);
    const [isOpen, setIsOpen] = useState({ open: false, type: "create" });
    const [isVisible, setIsVisible] = useState(false);
    const [song, setSong] = useState()
    const [pageLoading, setPageLoading] = useState<boolean>(false);

    const toggleSearch = () => {
        setIsVisible((prev) => !prev);
        setResults([]);
    };

    const toggleDrawer = (open: boolean, type: "create" | "add") => (event: React.KeyboardEvent | React.MouseEvent) => {
        if (event.type === "keydown" && ((event as React.KeyboardEvent).key === "Tab" || (event as React.KeyboardEvent).key === "Shift")) {
            return;
        }
        setIsOpen({ open: open, type });
    };

    const getPlayLists = async () => {
        try {
            const response = await musicApi.getPlayListByUserId();
            setPageLoading(false);
            if (response.data.success) {
                setPlayLists(response.data.data)
                return;
            }
            toast.error(response.data.message)
            return;
        }
        catch (err) {
            toast.error("Something went wrong!")
            console.log(err);
            return;
        }
    }

    const getSpotifyToken = async () => {
        const token = await fetchSpotifyAccessToken();
        setSpotifyToken(token)
    }

    useEffect(() => {
        getSpotifyToken()
    }, [])


    return (
        <AppContext.Provider value={{ user, setUser, spotifyToken, setSpotifyToken, results, setResults, playLists, getPlayLists, isOpen, setIsOpen, toggleDrawer, isVisible, toggleSearch, song, setSong, pageLoading, setPageLoading }}>
            {children}
        </AppContext.Provider>
    );
};
