import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { fetchSpotifyAccessToken } from '../api/apis';

type AppContextType = {
    user: any;
    setUser: React.Dispatch<React.SetStateAction<any | null>>;
    spotifyToken: string,
    setSpotifyToken: React.Dispatch<React.SetStateAction<string>>;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<any>();
    const [spotifyToken, setSpotifyToken] = useState<string>("");

    const getSpotifyToken = async () => {
        const token = await fetchSpotifyAccessToken();
        console.log("token", token);

        setSpotifyToken(token)
    }

    useEffect(() => {
        getSpotifyToken()
    }, [])
    return (
        <AppContext.Provider value={{ user, setUser, spotifyToken, setSpotifyToken }}>
            {children}
        </AppContext.Provider>
    );
};
