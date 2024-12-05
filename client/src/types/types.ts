export type SpotifyTrack = {
    id: string;
    name: string;
    artists: { name: string }[];
    album: { name: string; images: { url: string }[] };
};

export type SearchResult = {
    tracks: SpotifyTrack[];
};

export type SignUpUser = {
    name: string
    email: string
    password: string
}

export type SignInUser = {
    email: string
    password: string
}