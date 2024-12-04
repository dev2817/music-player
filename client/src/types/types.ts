export type SpotifyTrack = {
    id: string;
    name: string;
    artists: { name: string }[];
    album: { name: string; images: { url: string }[] };
};

export type SearchResult = {
    tracks: SpotifyTrack[];
};