"use-strict"
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'

import mysql from 'mysql2/promise'
import {DB_USERNAME,DB_PASSWORD} from './Const.js'
import db from './dbConfig.js'

import LikeOperator from "./Operators.js"

import fs from 'fs'

//importare entitati
import FavouriteList from './models/favouriteList.js'
import Video from './models/Video.js'

let app = express();
let router = express.Router();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use("/api", router);


//CREARE CONEXIUNE PENTRU BAZA DE DATE
let conexiune;

mysql.createConnection({
    user:DB_USERNAME,
    password:DB_PASSWORD
})
.then(connection =>{
    conexiune=connection;
    return connection.query("CREATE DATABASE IF NOT EXISTS ExamenTW");
})
.then(()=>{
    return conexiune.end();
})
.catch(err=>{
    console.log(err);
})



//Legatura dintre cele 2 entitati
FavouriteList.hasMany(Video, { as: "Videos", foreignKey: "FavouriteListId" });
Video.belongsTo(FavouriteList, { foreignKey: "FavouriteListId" });



//GET

async function getFavouriteListFull() {
    return await FavouriteList.findAll({ include: ["Videos"] });
}
router.route('/getFavouriteListFull').get(async (req, res) => {
    try {
        return res.json(await getFavouriteListFull());
    }
    catch (err) {
        console.log(err.message);
    }
})



async function getFavouriteLists() {
    return await FavouriteList.findAll();
}
router.route('/getFavouriteLists').get(async (req, res) => {
    try {
        return res.json(await getFavouriteLists());
    }
    catch (err) {
        console.log(err.message);
    }
})



async function getFavouriteListById(id) {
    return await FavouriteList.findOne(
        {
            where: id ? { FavouriteListId: id } : undefined
        }
    );
}
router.route('/getFavouriteListById/:id').get(async (req, res) => {
    try {
        return res.json(await getFavouriteListById(req.params.id));
    }
    catch (err) {
        console.log(err.message);
    }
})

async function getVideosByFavouriteList(idFavouriteList) {
    if (!(await getFavouriteListById(idFavouriteList))) {
        console.log("Nu s-a gasit acest FavouriteList!");
        return;
    }
    return await Video.findAll({
        include: [{ model: FavouriteList, attributes: ["FavouriteListDescriere"], where: idFavouriteList ? { FavouriteListId: idFavouriteList } : undefined }]
    });
}
router.route('/getVideosByFavouriteList/:idFavouriteList').get(async (req, res) => {
    try {
        return res.json(await getVideosByFavouriteList(req.params.idFavouriteList));
    }
    catch (err) {
        console.log(err.message);
    }
})


async function getVideoByFavouriteList(idFavouriteList, idVideo) {
    if (!(await getFavouriteListById(idFavouriteList))) {
        console.log("Nu s-a gasit FavouriteList!");
        return;
    }
    return await Video.findOne(
        {
            include: [{ model: FavouriteList, attributes: ["FavouriteListDescriere"], where: idFavouriteList ? { FavouriteListId: idFavouriteList } : undefined }],
            where: idVideo ? { VideoId: idVideo } : undefined
        }
    )
}
router.route('/getVideoByFavouriteList/:idFavouriteList/:idVideo').get(
    async (req, res) => {
        try {
            return res.json(await getVideoByFavouriteList(req.params.idFavouriteList, req.params.idVideo));
        } catch (err) {
            console.log(err.message);
        }
    }
)


// FILTRARE
async function getFavouriteListFilter(filterQuery) {
    let whereClause = {};

    if (filterQuery.name)
        whereClause.FavouriteListDescriere = { [LikeOperator]: `%${filterQuery.name}%` };
    if (filterQuery.data)
        whereClause.FavouriteListDate = { [LikeOperator]: `%${filterQuery.data}%` };

    return await FavouriteList.findAll({
        where: whereClause
    })
}
router.route('/getFavouriteListFilter').get(async (req, res) => {
    try {
        return res.json(await getFavouriteListFilter(req.query));
    }
    catch (err) {
        console.log(err.message);
    }
})

// SORTARE

async function getFavouriteListSortateData() {
    return await FavouriteList.findAll({
        order: [
            ["FavouriteListDate", "DESC"]
        ]
    });
}
router.route('/getFavouriteListSortateData').get(async (req, res) => {
    try {
        return res.json(await getFavouriteListSortateData());
    }
    catch (err) {
        console.log(err.message);
    }
})


//EXPORT
async function exportFavouriteListFull() {
    if (!fs.existsSync("./exported"))
        fs.mkdirSync("./exported")
    fs.writeFileSync("./exported/favouriteLists_full.json", JSON.stringify(await getFavouriteListFull()));
}
router.route('/exportFavouriteListFull').get(async (req, res) => {
    try {
        await exportFavouriteListFull();
        res.download("./exported/favouriteLists_full.json", "downloadCompaniesFull.json");
    } catch (err) {
        console.log(err.message);
    }
})




//POST

async function createFavouriteList(favouriteList) {
    return await FavouriteList.create(favouriteList);
}
router.route('/addFavouriteList').post(async (req, res) => {
    try {
        return res.status(201).json(await createFavouriteList(req.body));
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ error_message: "Internal server error! Could not insert fvaouriteList!" });
    }
})


async function createVideo(video, idFavouriteList) {
    if (!(await getFavouriteListById(idFavouriteList))) {
        console.log("Nu s-a gasit FavouriteList!");
        return;
    }
    video.FavouriteListId = idFavouriteList;
    return await Video.create(video);
}
router.route('/addVideo/:idFavouriteList').post(async (req, res) => {
    try {
        return res.status(201).json(await createVideo(req.body, req.params.idFavouriteList));
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ error_message: "Internal server error! Could not insert video!" });
    }
})



//PUT

async function updateFavouriteList(updatedFavouriteList, idFavouriteList) {
    if (parseInt(idFavouriteList) !== updatedFavouriteList.FavouriteListId) {
        console.log("ID este diferit !");
        return;
    }
    let favouriteList = await getFavouriteListById(idFavouriteList);
    if (!favouriteList) {
        console.log("FavouriteList cu acest id nu exista! ");
        return;
    }

    return await favouriteList.update(updatedFavouriteList);
}
router.route('/updateFavouriteList/:idFavouriteList').put(async (req, res) => {
    try {
        return res.json(await updateFavouriteList(req.body, req.params.idFavouriteList));
    } catch (err) {
        console.log(err.message);
    }
})




async function updateVideo(updatedVideo, idFavouriteList, idVideo) {
    if (parseInt(idVideo) !== updatedVideo.VideoId) {
        console.log("ID este diferit!");
        return;
    }

    let favouriteList = await getFavouriteListById(idFavouriteList);
    if (!favouriteList) {
        console.log("FavouriteList cu acest id nu exista! ");
        return;
    }

    let video = await getVideoByFavouriteList(idFavouriteList, idVideo);
    if (!favouriteList) {
        console.log("Video cu acest id nu exista!");
        return;
    }

    return await video.update(updatedVideo);
}
router.route('/updateVideo/:idFavouriteList/:idVideo').put(async (req, res) => {
    try {
        return res.json(await updateVideo(req.body, req.params.idFavouriteList, req.params.idVideo));
    } catch (err) {
        console.log(err.message);
    }
})



//DELETE

async function deleteFavouriteList(idFavouriteList) {
    let favouriteListToBeDeleted = await getFavouriteListById(idFavouriteList);

    if (!favouriteListToBeDeleted) {
        console.log("FavouriteList cu acest id nu exista!");
        return;
    }

    return await favouriteListToBeDeleted.destroy();
}
router.route("/deleteFavouriteList/:idFavouriteList").delete(async (req, res) => {
    try {
        return res.json(await deleteFavouriteList(req.params.idFavouriteList));
    } catch (err) {
        console.log(err.message);
    }
})


async function deleteVideo(idFavouriteList, idVideo) {

    let favouriteList = await getFavouriteListById(idFavouriteList);
    if (!favouriteList) {
        console.log("FavouriteList cu acest id nu exista!");
        return;
    }

    let videoToBeDeleted = await getVideoByFavouriteList(idFavouriteList, idVideo);

    if (!videoToBeDeleted) {
        console.log("Video cu acest id nu exista in acest FavouriteList!");
        return;
    }

    return await videoToBeDeleted.destroy();
}
router.route("/deleteVideo/:idFavouriteList/:idVideo").delete(async (req, res) => {
    try {
        return res.json(await deleteVideo(req.params.idFavouriteList, req.params.idVideo));
    } catch (err) {
        console.log(err.message);
    }
})


//PORT
let port = process.env.PORT ||8080;
app.listen(port,async()=>{
    await db.sync({alert:true});
    console.log("Baza de date a fost sincronizata cu succes!");
});
console.log("Running on port: " +port);