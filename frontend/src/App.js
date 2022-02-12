import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import TabelFavouriteList from './components/FavouriteList.js'
import FormularFavouriteList from './components/Formular_FavouriteList.js'
import TabelVideos from './components/Video.js'
import FormularVideo from './components/FormularVideo.js'

function App() {
  return (
    <div className="App">
     <BrowserRouter>
     <Routes>
       
       <Route path='/' element={<TabelFavouriteList></TabelFavouriteList>}></Route>
       <Route path='/formularFavouriteList' element={<FormularFavouriteList></FormularFavouriteList>}></Route>
       <Route path='/videos' element={<TabelVideos></TabelVideos>}></Route>
       <Route path='/formularVideo' element={<FormularVideo></FormularVideo>}></Route>

     </Routes>
     </BrowserRouter>
    </div>
  );
}

export default App;
