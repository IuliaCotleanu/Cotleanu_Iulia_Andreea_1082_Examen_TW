import axios from 'axios'

import {
    routeGetFavouriteListFull,routeGetFavouriteLists,routeGetFavouriteListById,routeGetVideosByFavouriteList,routeGetVideoByFavouriteList,
    routeGetFavouriteListSortate,routeExportFavouriteListFull,routePostFavouriteList,routePostVideo,
    routePutFavouriteList,routePutVideo,routeDeleteFavouriteList,routeDeleteVideo
} from './ApiRoutes.js'

async function get(p_url,searchAfter1 = null,searchAfter2=null){
    try{
        let newUrl;
        if(searchAfter1){
            newUrl = p_url+"/"+searchAfter1;
            if(searchAfter2){
                newUrl = newUrl +"/"+searchAfter2;
            }
        }else{
            newUrl = p_url;
        }

        return (await axios.get(newUrl)).data;

    }catch(err){
        if(p_url === routeGetFavouriteListFull)
            alert('Nu am putut prelua FavouriteListFull')
        if (p_url === routeGetFavouriteLists)
            alert('Nu am putut prelua FavouriteLists');
        if (p_url === routeGetFavouriteListSortate)
            alert('Nu am putut prelua FavouriteList sortate');
        if (p_url === routeExportFavouriteListFull)
            alert('Nu am putut exporta FavouriteListFull');
        if (p_url === routeGetFavouriteListById)
            alert('Nu am putut prelua FavouriteList cu acest id');
        if (p_url === routeGetVideosByFavouriteList)
            alert('Nu am putut prelua videoclipurile din FavouriteList');
        if (p_url === routeGetVideoByFavouriteList)
            alert('NU am putut prelua acest videoclip din FavouriteList');
    }
}

async function getQuery(p_url, p_descriere, p_data) {
    try {
        const params = new URLSearchParams({ name: p_descriere, data: p_data });
        let urlFilter = p_url + "?";
        return (await axios.get(`${urlFilter}${params}`)).data;
    } catch (err) {
        alert("FavouriteList filtrate dupa descriere sau data nu au putut fi preluate!");
    }
}

async function post(p_url, item, id = null) {
    try {
        let newUrl = id ? p_url + "/" + id : p_url;
        return (await axios.post(
            newUrl,
            item,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )).data;
    } catch (err) {
        if (p_url === routePostFavouriteList) {
            alert('Eroare la inserare FavouriteList!');
        }
        if (p_url === routePostVideo) {
            alert('Eroare la inserare video!');
        }
    }
}


async function put(p_url, item, searchAfter1, searchAfter2 = null) {
    try {
        let newUrl;
        newUrl = p_url + "/" + searchAfter1;
        if (searchAfter2) {
            newUrl = newUrl + "/" + searchAfter2;
        }

        return (await axios.put(
            newUrl,
            item,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )).data;
    } catch (err) {
        if (p_url === routePutFavouriteList) {
            alert('Eroare, FavouriteList nu a putut fi modificat!');
        }
        if (p_url === routePutVideo) {
            alert('Eroare, Video nu a putut fi modificat!');
        }
    }
}

async function remove(p_url, searchAfter1, searchAfter2 = null) {
    try {
        let newUrl;
        newUrl = p_url + "/" + searchAfter1;
        if (searchAfter2) {
            newUrl = newUrl + "/" + searchAfter2;
        }

        return (await axios.delete(newUrl)).data;
    } catch (err) {
        if (p_url === routeDeleteFavouriteList) {
            alert('Eroare, FavouriteList nu a putut fi sters!');
        }
        if (p_url === routeDeleteVideo) {
            alert('Eroare, Video nu a putut fi sters!');
        }
    }
}

export { get, getQuery, post, put, remove }