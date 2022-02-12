import { useState, useEffect } from 'react';
import { get, remove } from '../Calls.js';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import HomeIcon from '@material-ui/icons/Home';
import { Button, Paper, Table, TableBody, TableCell, TableRow, TableContainer, TableHead, IconButton } from "@material-ui/core";
import { routeDeleteVideo, routeGetVideosByFavouriteList } from '../ApiRoutes.js';

export default function TabelVideos() {

    const navigate = useNavigate();

    const [rows, setRows] = useState([]);
    const [needToUpdate, setNeedToUpdate] = useState(false)

    useEffect( () => {
        async function f(){
        let data = await get(routeGetVideosByFavouriteList, JSON.parse(sessionStorage.getItem("idFavouriteList")));
        setRows(data);
        }
        f()
    }, [needToUpdate]);

    useEffect( () => {async function f(){
        sessionStorage.setItem("putScreen", "");
        sessionStorage.setItem("idVideo", "");
    }
    f()
    }, [])

    const goToFormularUpdateVideo = (idVideo) => {
        sessionStorage.setItem("putScreen", true);
        sessionStorage.setItem("idVideo", idVideo);
        navigate('/formularVideo');
    }

    const deletevideo = async (idVideo, index) => {
        await remove(routeDeleteVideo, JSON.parse(sessionStorage.getItem("idFavouriteList")), idVideo);

        rows.splice(index, 1);
        setRows(rows);
        setNeedToUpdate(!needToUpdate);
    }

    const goToFormularAdaugareVideo = () => {
        sessionStorage.setItem("putScreen", "false");
        navigate('/formularVideo');
    }

    return (
        <div>
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID video</TableCell>
                            <TableCell align="center">Descriere Video</TableCell>
                            <TableCell align="center">Titlu Video</TableCell>
                            <TableCell align="center">Url Video</TableCell>

                            <TableCell align="center">Id-ul FavouriteList de care apartine</TableCell>
                            <TableCell align="center">Actiuni Video</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row, index) => (
                            <TableRow key={row.VideoId}>
                                <TableCell component="th" scope="row">
                                    {row.VideoId}
                                </TableCell>
                                <TableCell align="center">{row.VideoDescriere}</TableCell>
                                <TableCell align="center">{row.VideoTitlu}</TableCell>
                                <TableCell align="center">{row.VideoUrl}</TableCell>

                             
                                <TableCell align="center">{row.FavouriteListId}</TableCell>
                                <TableCell align="center">
                                    <IconButton onClick={() => goToFormularUpdateVideo(row.VideoId)}>
                                        <EditIcon color="primary" />
                                    </IconButton>
                                    <IconButton onClick={() => deletevideo(row.VideoId, index)}>
                                        <DeleteIcon color="secondary" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <br />
            <Button color="secondary" variant='contained' startIcon={<AddIcon />} onClick={() => goToFormularAdaugareVideo()}>
                Adauga video nou
            </Button>
            <br />
            <br />
            <Button color="secondary" variant='contained' endIcon={<HomeIcon/>}onClick={() => navigate('/')}>
                Inapoi la FavouriteList
            </Button>
        </div >
    )
}