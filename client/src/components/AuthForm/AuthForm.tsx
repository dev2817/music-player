import { Box, Button, TextField } from "@mui/material"
import "./AuthForm.css"
import { useState } from "react"
import { Link } from "react-router-dom"
import toast from "react-hot-toast"
import { authApi } from "../../api/apis"
import { SignInUser, SignUpUser } from "../../types/types"

type TAuthForm = {
    type: 'sign-up' | 'sign-in'
}

export default function AuthForm({ type }: TAuthForm) {
    const [user, setUser] = useState<SignInUser | SignUpUser | null>(null);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        name: keyof (SignInUser & SignUpUser)
    ) => {
        setUser((prevState) => {
            const updatedUser = {
                ...(prevState || {}),
                [name]: e.target.value,
            };
            return updatedUser as SignInUser | SignUpUser;
        });
    };

    const handleSignUp = async () => {
        try {
            const response = await authApi.signUp(user as SignUpUser);
            if (response.data.success) {
                toast.success("User registered successfully")
                console.log(response.data.data);
                return;
            }
            toast.error(response.data.message);
            return;
        }
        catch (err: any) {
            console.log(err);
            toast.error("Something went wrong!")
        }
    }

    const handleSignIn = async () => {
        try {
            const response = await authApi.signIn(user as SignInUser);
            if (response.data.success) {
                toast.success("User logged in successfully")
                console.log(response.data.data);
                return;
            }
            toast.error(response.data.message);
            return;
        }
        catch (err: any) {
            console.log(err);
            toast.error("Something went wrong!")
        }
    }


    const handleSubmit = async () => {
        try {
            if (type === "sign-in") {
                await handleSignIn();
            } else {
                await handleSignUp();
            }
        } catch (error) {
            console.error(error);
        }
    };


    return (
        <div className="auth-form">
            <Box className="auth-box">
                <h1>{type === "sign-in" ? "Sign In" : "Sign Up"}</h1>
                {type === "sign-up" && (
                    <TextField
                        type="text"
                        name="name"
                        label="Name"
                        variant="outlined"
                        fullWidth
                        onChange={(e) => handleChange(e, "name")}
                        value={user && "name" in user ? user.name : ""}
                    />
                )}
                <TextField
                    type="email"
                    name="email"
                    label="Email"
                    variant="outlined"
                    fullWidth
                    onChange={(e) => handleChange(e, "email")}
                    value={user?.email}
                />
                <TextField
                    type="password"
                    name="password"
                    label="Password"
                    variant="outlined"
                    fullWidth
                    onChange={(e) => handleChange(e, "password")}
                    value={user?.password}
                />
                <Button fullWidth variant="contained" onClick={() => { handleSubmit() }} className="auth-button">
                    {type === "sign-in" ? "Sign In" : "Sign Up"}
                </Button>
                <Box className="auth-link-box">
                    <span>
                        {type === "sign-up" ? "Already have an account?" : "Don't have an account?"}
                    </span>
                    <Link to={type === "sign-up" ? "/sign-in" : "/sign-up"}>
                        {type === "sign-up" ? "Sign In" : "Sign Up"}
                    </Link>
                </Box>
            </Box>
        </div>
    )
}

// const { spotifyToken } = useApp();
//     const [query, setQuery] = useState("");
//     const [results, setResults] = useState<any[]>([]);
//     console.log(results);

//     const handleSearch = async () => {
//         try {
//             const searchResults = await searchSpotifySongs(query, spotifyToken);
//             setResults(searchResults.tracks);
//         } catch (error) {
//             console.error(error);
//         }
//     };
// <div>
// <input
//     type="text"
//     value={query}
//     onChange={(e) => setQuery(e.target.value)}
//     placeholder="Search for songs"
// />
// <button onClick={handleSearch}>Search</button>
// <ul>
//     {results.map((track) => (
//         <Link target="_blank" to={track.album.uri}>
//             <li key={track.id}>
//                 <strong>{track.name}</strong> by{" "}
//                 {track.artists.map((artist) => artist.name).join(", ")}
//             </li>
//         </Link>

//     ))}
// </ul>
// </div>