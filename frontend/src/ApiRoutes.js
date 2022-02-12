const link = "http://localhost:8080/api"

//GET
const routeGetFavouriteListFull = link +'/getFavouriteListFull';
const routeGetFavouriteLists = link +'/getFavouriteLists';
const routeGetFavouriteListById = link+'/getFavouriteListById';
const routeGetVideosByFavouriteList = link +'/getVideosByFavouriteList';
const routeGetVideoByFavouriteList = link+'/getVideoByFavouriteList';
const routeGetFavouriteListFilter = link +'/getFavouriteListFilter';
const routeGetFavouriteListSortate = link +'/getFavouriteListSortateData';
const routeExportFavouriteListFull = link +'/exportFavouriteListFull';

//POST
const routePostFavouriteList = link +'/addFavouriteList';
const routePostVideo = link +'/addVideo';

//PUT
const routePutFavouriteList = link +'/updateFavouriteList';
const routePutVideo = link +'/updateVideo';

//DELETE
const routeDeleteFavouriteList = link +"/deleteFavouriteList";
const routeDeleteVideo = link+ "/deleteVideo";

export{
    routeGetFavouriteListFull,routeGetFavouriteLists,routeGetFavouriteListById,routeGetVideosByFavouriteList,routeGetVideoByFavouriteList,
    routeGetFavouriteListFilter,routeGetFavouriteListSortate,routeExportFavouriteListFull,routePostFavouriteList,routePostVideo,
    routePutFavouriteList,routePutVideo,routeDeleteFavouriteList,routeDeleteVideo
}