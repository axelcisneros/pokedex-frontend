import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Header from '../Header/Header';
import Main from '../Main/Main';
import Footer from '../Footer/Footer';
import UserContext from '../../context/UserContext';
import { getCurrentUser } from '../../utils/MainApi';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('');
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('jwt') || '');

  useEffect(() => {
    // Cargar favoritos del localStorage
    const savedFavorites = localStorage.getItem('pokemonFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }

    // Verificar usuario autenticado
    if (token) {
      getCurrentUser(token).then((data) => {
        if (data && data.email) {
          setUser(data);
          setIsLoggedIn(true);
        } else {
          setUser(null);
          setIsLoggedIn(false);
        }
      }).catch(() => {
        setUser(null);
        setIsLoggedIn(false);
      });
    } else {
      setUser(null);
      setIsLoggedIn(false);
    }

    // Simular tiempo de carga inicial
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [token]);

  const handleToggleFavorite = (pokemon) => {
    setFavorites(prevFavorites => {
      const isFavorite = prevFavorites.some(fav => fav.name === pokemon.name);
      let newFavorites;
      if (isFavorite) {
        newFavorites = prevFavorites.filter(fav => fav.name !== pokemon.name);
      } else {
        newFavorites = [...prevFavorites, pokemon];
      }
      localStorage.setItem('pokemonFavorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
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
