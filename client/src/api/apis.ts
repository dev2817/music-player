import axios from "axios";
import { SearchResult, SignInUser, SignUpUser } from "../types/types";

export const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL;
console.log(import.meta.env);

export const spotifyTokenUrl = "https://accounts.spotify.com/api/token";
export const spotifySearchUrl = "https://api.spotify.com/v1/search";

export const authApi = {
    signUp: async (data: SignUpUser) => {
        return await axios.post(`${baseUrl}/signUp`, data);
    },
    signIn: async (data: SignInUser) => {
        return await axios.post(`${baseUrl}/signIn`, data);
    },
    getUserById: async () => {
        return await axios.get(`${baseUrl}/getUserById`);
    },
}

export const musicApi = {
    createPlayList: async () => {
        return await axios.post(`${baseUrl}/createPlayList`);
    },
    updatePlayList: async () => {
        return await axios.put(`${baseUrl}/updatePlayList`);
    },
    getPlayListByUserId: async () => {
        return await axios.get(`${baseUrl}/getPlayListByUserId`);
    },
    getPlayListById: async () => {
        return await axios.get(`${baseUrl}/getPlayListById`);
    },
    deletePlayList: async () => {
        return await axios.get(`${baseUrl}/deletePlayList`);
    },
}

export const fetchSpotifyAccessToken = async () => {
    try {
        const response = await axios.post(
            `${spotifyTokenUrl}`,
            new URLSearchParams({
                grant_type: "client_credentials",
                client_id: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
                client_secret: import.meta.env.VITE_SPOTIFY_CLIENT_SECRET
            }),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );

        return response.data.access_token;
    } catch (error) {
        console.error("Error fetching Spotify access token", error);
        throw new Error("Failed to fetch access token");
    }
};

export const searchSpotifySongs = async (
    query: string,
    token: string
): Promise<SearchResult> => {
    try {
        const response = await axios.get(`${spotifySearchUrl}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                q: query,
                type: "track",
                limit: 10,
            },
        });

        return {
            tracks: response.data.tracks.items.map((item: any) => ({
                id: item.id,
                name: item.name,
                artists: item.artists,
                album: item.album,
            })),
        };
    } catch (error) {
        console.error("Error searching Spotify songs", error);
        throw new Error("Failed to fetch search results");
    }
};