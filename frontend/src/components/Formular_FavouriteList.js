import { useState, useEffect } from 'react';
import { get, put, post } from '../Calls.js';
import { useNavigate } from 'react-router-dom';
import SaveIcon from '@material-ui/icons/Save'
import { Grid, TextField, Button } from '@material-ui/core';
import { routeGetFavouriteListById, routePostFavouriteList, routePutFavouriteList } from '../ApiRoutes.js';

export default function FormularFavouriteList() {

    const navigate = useNavigate();

    const [favouriteList, setFavouriteList] = useState({
        FavouriteListId: 0,
        FavouriteListDescriere: "",
        FavouriteListDate: "",
     
    })

    const onChangeFavouriteList = e => {
        setFavouriteList({ ...favouriteList, [e.target.name]: e.target.value });
    }

    const saveFavouriteList= async () => {
        if (!JSON.parse(sessionStorage.getItem("putScreen")))
            await post(routePostFavouriteList, favouriteList);
        else
            await put(routePutFavouriteList, favouriteList, favouriteList.FavouriteListId);

        navigate('/');
    }

    useEffect( () => {
        async function f(){
        if (JSON.parse(sessionStorage.getItem('putScreen'))) {
            let data = await get(routeGetFavouriteListById, JSON.parse(sessionStorage.getItem("idFavouriteList")));
            setFavouriteList(data);
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
                        id="FavouriteListId"
                        name="FavouriteListId"
                        label="Id-ul FavouriteList"
                        fullWidth
                        variant='filled'
                        disabled={true}
                        value={favouriteList.FavouriteListId}
                        onChange={e => onChangeFavouriteList(e)} />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        margin="dense"
                        id="FavouriteListDescriere"
                        name="FavouriteListDescriere"
                        label="Descriere FavouriteList"
                        fullWidth
                        variant='filled'
                        value={favouriteList.FavouriteListDescriere}
                        onChange={e => onChangeFavouriteList(e)} />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        margin="dense"
                        id="FavouriteListDate"
                        name="FavouriteListDate"
                        label="Data FavouriteList"
                        variant='filled'
                        fullWidth
                        value={favouriteList.FavouriteListDate}
                        onChange={e => onChangeFavouriteList(e)} />
                </Grid>
                
            </Grid>

            <br />

            <Button color="primary" variant='outlined' startIcon={<SaveIcon />} onClick={() => saveFavouriteList()}>
                Save
            </Button>
        </div>
    )
}