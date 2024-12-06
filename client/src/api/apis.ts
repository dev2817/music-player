import axios from "axios";
import { SearchResult, SignInUser, SignUpUser } from "../types/types";
import axiosInstance from "../utils/axiosInstance";

export const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL;

export const spotifyTokenUrl = "https://accounts.spotify.com/api/token";
export const spotifySearchUrl = "https://api.spotify.com/v1/search";

export const authApi = {
    signUp: async (data: SignUpUser) => {
        return await axiosInstance.post(`${baseUrl}/signUp`, data);
    },
    signIn: async (data: SignInUser) => {
        return await axiosInstance.post(`${baseUrl}/signIn`, data);
    },
    getUserById: async () => {
        return await axiosInstance.get(`${baseUrl}/getUserById`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            }
        });
    },
}

export const musicApi = {
    createPlayList: async (data: { name: string }) => {
        return await axiosInstance.post(`${baseUrl}/createPlayList`, data, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            }
        });
    },
    updatePlayList: async (playListId: string, data: any) => {
        return await axiosInstance.put(`${baseUrl}/updatePlayList/${playListId}`, data, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            }
        });
    },
    getPlayListByUserId: async () => {
        return await axiosInstance.get(`${baseUrl}/getPlayListByUserId`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            }
        });
    },
    getPlayListById: async (playListId: string) => {
        return await axiosInstance.get(`${baseUrl}/getPlayListById/${playListId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            }
        });
    },
    deletePlayList: async (playListId: string) => {
        return await axios.delete(`${baseUrl}/deletePlayList/${playListId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            }
        });
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