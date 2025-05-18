import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Header from '../Header/Header';
import Main from '../Main/Main';
import Footer from '../Footer/Footer';
import UserContext from '../../context/UserContext';
import { getCurrentUser, getUserFavorites, addFavoritePokemon, removeFavoritePokemon } from '../../utils/MainApi';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('');
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('jwt') || '');

  // Cargar favoritos desde la base de datos cuando el usuario inicia sesión
  useEffect(() => {
    if (token) {
      getCurrentUser(token).then((data) => {
        if (data && data.email) {
          setUser(data);
          setIsLoggedIn(true);
          // Cargar favoritos del backend
          getUserFavorites(token).then((favData) => {
            setFavorites(Array.isArray(favData) ? favData : []);
          });
        } else {
          setUser(null);
          setIsLoggedIn(false);
          setFavorites([]);
        }
      }).catch(() => {
        setUser(null);
        setIsLoggedIn(false);
        setFavorites([]);
      });
    } else {
      setUser(null);
      setIsLoggedIn(false);
      setFavorites([]);
    }
    // Simular tiempo de carga inicial
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [token]);

  // Handler para agregar o quitar favoritos usando la base de datos
  const handleToggleFavorite = (pokemon) => {
    if (!isLoggedIn) return;
    const isFavorite = favorites.some(fav => fav.name === pokemon.name);
    if (isFavorite) {
      // Buscar el favorito por nombre para obtener el _id
      const favToRemove = favorites.find(fav => fav.name === pokemon.name);
      if (favToRemove && favToRemove._id) {
        removeFavoritePokemon(favToRemove._id, token).then(() => {
          setFavorites(prev => prev.filter(fav => fav._id !== favToRemove._id));
        });
      }
    } else {
      addFavoritePokemon(pokemon, token).then((created) => {
        if (created && created._id) {
          setFavorites(prev => [...prev, created]);
        }
      });
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFilter = (selectedFilter) => {
    setFilter(selectedFilter);
  };

  // El preloader y el modal de login se gestionan ahora en Main
  return (
    <UserContext.Provider value={{ user, setUser, isLoggedIn, setIsLoggedIn, token, setToken }}>
      <div className="app">
        <div className="app__content">
          <Header onSearch={handleSearch} onFilter={handleFilter} />
          <Routes>
            <Route 
              path="*" 
              element={
                <Main 
                  favorites={favorites}
                  onToggleFavorite={handleToggleFavorite}
                  searchQuery={searchQuery}
                  filter={filter}
                  isLoading={isLoading}
                />
              } 
            />
          </Routes>
          <Footer />
        </div>
      </div>
    </UserContext.Provider>
  );
}

export default App;
