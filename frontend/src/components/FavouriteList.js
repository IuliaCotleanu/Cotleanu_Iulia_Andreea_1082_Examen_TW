import { useState, useEffect } from 'react';
import { get, getQuery, remove } from '../Calls.js';
import { useNavigate } from 'react-router-dom';

import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import SendIcon from '@material-ui/icons/Send'
import { Grid, TextField, Button, Paper, Table, TableBody, TableCell, TableRow, TableContainer, TableHead, IconButton } from "@material-ui/core";
import { routeDeleteFavouriteList, routeGetFavouriteListFilter, routeGetFavouriteLists, routeGetFavouriteListSortate } from '../ApiRoutes.js';

export default function TabelFavouriteList() {

    const navigate = useNavigate();

    const [rows, setRows] = useState([]);
    const [needToUpdate, setNeedToUpdate] = useState(false)
    const [filtrare, setFiltrare] = useState({
        FavouriteListDescriere: "",
        FavouriteListDate: ""
    })


    useEffect( () =>{async function f() {
        let data = await get(routeGetFavouriteLists);
        setRows(data);
    }
    f()
     }, [needToUpdate]);

    useEffect( () => {async function f(){
        sessionStorage.clear();
    }
    f()
    }, [])



    const onChangeFiltrare = e => {
        setFiltrare({ ...filtrare, [e.target.name]: e.target.value });
    }
    const filtrareFavouriteList = async () => {
        let data = await getQuery(routeGetFavouriteListFilter, filtrare.FavouriteListDescriere, filtrare.FavouriteListDate);
        setRows(data);
    }
    const goToFormularModificareFavouriteList = (id) => {
        sessionStorage.setItem("putScreen", true);
        sessionStorage.setItem("idFavouriteList", id);
        navigate('/formularFavouriteList');
    }
    const goToFormularAdaugareFavouriteList = () => {
        sessionStorage.setItem("putScreen", "false");
        navigate('/formularFavouriteList');
    }


    const deleteFavouriteList = async (id, index) => {
        await remove(routeDeleteFavouriteList, id);

        rows.splice(index, 1);
        setRows(rows);
        setNeedToUpdate(!needToUpdate);
    }
    const sortare = async () => {
        let data = await get(routeGetFavouriteListSortate);
        setRows(data);
    }

  
    const goToTabelVideos = (idFavouriteList) => {
        sessionStorage.setItem("idFavouriteList", idFavouriteList);
        navigate('/videos')
    }

    return (
        <div>
            <Grid container spacing={2}
                direction="row"
                justifyContent="space-evenly"
                alignItems="center">

               <Grid item xs={2}>
                    <Button color="primary" variant='contained' startIcon={<AddIcon />} onClick={() => goToFormularAdaugareFavouriteList()}>
                        Adauga o noua FavouriteList
                    </Button >
                </Grid>
                <Grid container item spacing={1} xs={3}
                    direction="column"
                    justifyContent="center"
                    alignItems="center">

                    <TextField
                        margin="dense"
                        id="FavouriteListDescriere"
                        name="FavouriteListDescriere"
                        label="Filtrare dupa descriere"
                        fullWidth
                        value={filtrare.FavouriteListDescriere}
                        onChange={e => onChangeFiltrare(e)}
                    />
                    <TextField
                        margin="dense"
                        id="FavouriteListDate"
                        name="FavouriteListDate"
                        label="Filtrare dupa data"
                        fullWidth
                        value={filtrare.FavouriteListDate}
                        onChange={e => onChangeFiltrare(e)}
                    />
                    <Button color="default" variant='contained' aria-label ="edit" onClick={() => filtrareFavouriteList()}>
                        Filtrare FavouriteList
                    </Button>

                </Grid>

                <Grid item xs={2}>
                    <Button color='default' variant='contained' size="medium" onClick={() => sortare()}>
                        Sorteaza descrescator dupa data
                    </Button >
                </Grid>

            </Grid>

            <br />

            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>FavouriteList ID</TableCell>
                            <TableCell align="center">Descriere FavouriteList</TableCell>
                            <TableCell align="center">Data FavouriteList</TableCell>
                            <TableCell align="center">Actiuni FavouriteList</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row, index) => (
                            <TableRow key={row.FavouriteListId}>
                                <TableCell component="th" scope="row">
                                    {row.FavouriteListId}
                                </TableCell>
                                <TableCell align="center">{row.FavouriteListDescriere}</TableCell>
                                <TableCell align="center">{row.FavouriteListDate}</TableCell>
                             
                                <TableCell align="center">
                                    <Button color="secondary" variant='contained' margin='dense' size="small" endIcon={<SendIcon />} onClick={() => goToTabelVideos(row.FavouriteListId)}>
                                        Vezi video
                                    </Button>
                                </TableCell>
                                <TableCell align="center">
                                    <IconButton onClick={() => goToFormularModificareFavouriteList(row.FavouriteListId)}>
                                        <EditIcon color="primary" />
                                    </IconButton>
                                    <IconButton onClick={() => deleteFavouriteList(row.FavouriteListId, index)}>
                                        <DeleteIcon color="secondary" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div >
    )
}