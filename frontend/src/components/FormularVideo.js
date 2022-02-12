import { useState, useEffect } from 'react';
import { get, put, post } from '../Calls.js';
import { useNavigate } from 'react-router-dom';
import SaveIcon from '@material-ui/icons/Save'
import { Grid, TextField, Button } from '@material-ui/core';
import { routeGetVideoByFavouriteList, routePostVideo, routePutVideo } from '../ApiRoutes.js';

export default function FormularVideo() {

    const navigate = useNavigate();

    const [video, setVideo] = useState({
        VideoId: 0,
        VideoDescriere: "",
        VideoTitlu: "",
        VideoUrl: "",
        FavouriteListId: JSON.parse(sessionStorage.getItem("idFavouriteList"))
    })

    const onChangeVideo = e => {
        setVideo({ ...video, [e.target.name]: e.target.value });
    }

    const saveVideo = async () => {
        if (!JSON.parse(sessionStorage.getItem("putScreen")))
            await post(routePostVideo, video, JSON.parse(sessionStorage.getItem("idFavouriteList")));
        else
            await put(routePutVideo, video, video.FavouriteListId, video.VideoId); 

        navigate('/videos');
    }

    useEffect( () => {
        async function f(){
        if (JSON.parse(sessionStorage.getItem('putScreen'))) {
            let data = await get(routeGetVideoByFavouriteList, JSON.parse(sessionStorage.getItem("idFavouriteList")), JSON.parse(sessionStorage.getItem("idVideo")));
            setVideo(data);
        }
    }
    f()
    }, [])

    return (
        <div>
            <Grid container
                spacing={2}
                direction="row"
                justifyContent="flex-start">

                <Grid item xs={2}>
                    <TextField
                        margin="dense"
                        id="VideoId"
                        name="VideoId"
                        label="Id Video"
                        fullWidth
                        disabled={true}
                        value={video.VideoId}
                        onChange={e => onChangeVideo(e)} />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        margin="dense"
                        id="VideoDescriere"
                        name="VideoDescriere"
                        label="Descriere Video"
                        variant='filled'
                        fullWidth
                        value={video.VideoDescriere}
                        onChange={e => onChangeVideo(e)} />
                </Grid>
                <Grid item xs={2}>
                    <TextField
                        margin="dense"
                        id="VideoTitlu"
                        name="VideoTitlu"
                        label="Titlu Video"
                        variant='filled'
                        fullWidth
                        value={video.VideoTitlu}
                        onChange={e => onChangeVideo(e)} />
                </Grid>

                <Grid item xs={2}>
                    <TextField
                        margin="dense"
                        id="VideoUrl"
                        name="VideoUrl"
                        label="Url Video"
                        variant='filled'
                        fullWidth
                        value={video.VideoUrl}
                        onChange={e => onChangeVideo(e)} />
                </Grid>
               
                <Grid item xs={2}>
                    <TextField
                        margin="dense"
                        id="FavouriteListId"
                        name="FavouriteListId"
                        label="Id-ul FavouriteList de care apartine"
                        fullWidth
                        variant='filled'
                        disabled={true}
                        value={video.FavouriteListId}
                        onChange={e => onChangeVideo(e)} />
                </Grid>
            </Grid>

            <br />

            <Button color="secondary" variant="outlined" startIcon={<SaveIcon />} onClick={() => saveVideo()}>
                Save
            </Button>
        </div>
    )
}