import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom"
import { musicApi } from "../../api/apis";
import DefaultImage from "../../../public/default.jpg"
import { Box, Button, Grid, IconButton, Modal, TextField, Typography } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import Close from '@mui/icons-material/Close';
import "./Playlist.css"
import DeleteIcon from '@mui/icons-material/Delete';
import { useApp } from "../../utils/useApp";
import ShareIcon from '@mui/icons-material/Share';
import Loading from "../../components/loading/Loading";
import Joi from "joi";

const playlistNameSchema = Joi.string()
    .min(3)
    .max(50)
    .required()
    .messages({
        "string.empty": "Playlist name is required",
        "string.min": "Playlist name must be at least 3 characters long",
        "string.max": "Playlist name must not exceed 50 characters",
    });

export default function Playlist() {
    const { playListId } = useParams();
    const { getPlayLists } = useApp()
    const [playlist, setPlaylist] = useState<any>();
    const [edit, setEdit] = useState(false);
    const [playlistName, setPlayListName] = useState<string>();
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const validatePlaylistName = (name: string): string | null => {
        const { error } = playlistNameSchema.validate(name);
        return error ? error.details[0].message : null;
    };

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleConfirm = async () => {
        handleClose();
        await deletePlaylist()
    };

    const deletePlaylist = async () => {
        try {
            const response = await musicApi.deletePlayList(playListId as string);
            setIsLoading(false)
            if (response.data.success) {
                toast.success("Playlist deleted successfully!")
                await getPlayLists();
                navigate('/dashboard')
                return
            }
            toast.error(response.data.message)
            return
        }
        catch (err) {
            console.log(err);
            toast.error("Something went wrong!")
        }
    }

    const handleNameChange = async () => {
        const error = await validatePlaylistName(playlistName as string);
        if (error) {
            toast.error(error);
            setIsLoading(false);
            return;
        }
        try {
            setIsLoading(true);
            await updatePlayList({ name: playlistName })
        }
        catch (err) {
            console.log(err);
        }
    }

    const updatePlayList = async (data: any) => {
        try {
            const response = await musicApi.updatePlayList(playListId as string, data)
            setIsLoading(false)
            if (response.data.success) {
                toast.success("Playlist updated successfully!")
                setEdit(false)
                await getPlaylist()
                return;
            }
            toast.error(response.data.message)
            return;
        }
        catch (err: any) {
            console.log(err);
            toast.error("Something went wrong!")
        }
    }

    const getPlaylist = async () => {
        try {
            const response = await musicApi.getPlayListById(playListId as string)
            setIsLoading(false)
            if (response.data.success) {
                setPlaylist(response.data.data)
                return;
            }
            toast.error(response.data.message);
            navigate('/dashboard')
            return
        }
        catch (err) {
            console.log(err);
            toast.error("Something went wrong!")
            navigate('/dashboard')
        }
    }

    const handleDeleteSong = async (songId: string) => {
        try {
            const newSongs = playlist.songs.filter((song: any) => song.songId !== songId).map((song: any) => song._id)
            await updatePlayList({ songs: newSongs })
        }
        catch (err) {
            console.log(err);
        }
    }

    const handleCopyUrl = () => {
        const currentUrl = window.location.href;
        navigator.clipboard.writeText(currentUrl)
        toast.success("URL Copied")
    }

    useEffect(() => {
        getPlaylist()
    }, [playListId])

    useEffect(() => {
        if (playlist) {
            setPlayListName(playlist?.name)
        }
    }, [playlist])
    return (
        <div className="playlist-page-container">
            <ArrowBackIcon
                onClick={() => navigate(-1)}
                className="back-icon"
                fontSize="large"
            />
            <img
                src={playlist?.songs[0]?.image || DefaultImage}
                alt=""
                className="playlist-header-image"
            />
            <Box className="playlist-content">
                <Box className="playlist-header">
                    {edit ? (
                        <Box className="edit-mode-container">
                            <TextField
                                type="text"
                                value={playlistName}
                                label="Playlist"
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setPlayListName(value);
                                    setError(validatePlaylistName(value));
                                }}
                                fullWidth
                                error={!!error}
                                helperText={error}
                            />

                            <Button onClick={async () => { await handleNameChange() }} variant="contained">
                                Save
                            </Button>
                            <Close onClick={() => setEdit(false)} fontSize="large" />
                        </Box>
                    ) : (
                        <Box className="view-mode-container">
                            <Typography variant="h4" className="playlist-title">
                                {playlist?.name}
                            </Typography>
                            <Box className="box-flex-gap">
                                <IconButton onClick={() => setEdit(true)}>
                                    <EditIcon fontSize="large" />
                                </IconButton>
                                <IconButton onClick={handleOpen}>
                                    <DeleteIcon color="error" fontSize="large" />
                                </IconButton>
                                <IconButton onClick={handleCopyUrl}>
                                    <ShareIcon fontSize="large" />
                                </IconButton>
                            </Box>
                        </Box>
                    )}
                </Box>
                <Box className="playlist-songs">
                    {playlist?.songs?.length > 0 && !isLoading && (
                        <Grid container spacing={2} className="playlist-grid-container" >
                            {playlist.songs.map((song: any, index: number) => (
                                <Grid item xs={12} sm={6} key={index} className="song-grid">
                                    <Box
                                        className="song-link"
                                    >
                                        <img
                                            src={song.image}
                                            alt={song.name}
                                            className="song-image"
                                        />
                                        <Link to={song.playbackUrl}
                                            target="_blank"
                                            rel="noopener noreferrer" className="song-details">
                                            <Typography variant="h6">{song?.name}</Typography>
                                            <Typography variant="body2">
                                                {song?.albumName}
                                            </Typography>
                                            <Typography variant="body2">
                                                {song?.releaseDate}
                                            </Typography>
                                        </Link>
                                    </Box>
                                    <IconButton onClick={async () => { setIsLoading(true); await handleDeleteSong(song.songId) }}>
                                        <DeleteIcon color="error" />
                                    </IconButton>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Box>
                {playlist?.songs?.length == 0 && !isLoading && <Typography variant="h5" className="centered-bold-box centered-bold-h-45">
                    You currently don't have any songs in your playlist, please add a song!
                </Typography>}
                <Modal
                    open={open}
                    onClose={handleClose}
                >
                    <Box
                        className="centered-box"
                    >
                        <Typography id="delete-playlist-title" variant="h6" gutterBottom>
                            Are you sure you want to delete the playlist {playlist?.name}?
                        </Typography>

                        <Box className="flex-end-gap">
                            <Button onClick={handleClose} variant="outlined" color="primary">
                                Close
                            </Button>

                            <Button onClick={async () => { setIsLoading(true); await handleConfirm() }} variant="contained" color="error">
                                Confirm
                            </Button>
                        </Box>
                    </Box>
                </Modal>
                {
                    playlist?.songs?.length !== 0 && isLoading && <Box className="centered-bold-box centered-bold-h-45">
                        <Loading />
                    </Box>
                }
            </Box>
        </div>
    )
}
