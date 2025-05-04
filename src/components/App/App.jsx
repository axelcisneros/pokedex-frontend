import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Header from '../Header/Header';
import Main from '../Main/Main';
import Footer from '../Footer/Footer';
import Preloader from '../Preloader/Preloader';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    // Cargar favoritos del localStorage
    const savedFavorites = localStorage.getItem('pokemonFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }

    // Simular tiempo de carga inicial
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

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

  return (
    <div className="app">
      {isLoading ? (
        <div className="app__preloader">
          <Preloader />
        </div>
      ) : (
        <>
          <Header />
          <Routes>
            <Route 
              path="/" 
              element={
                <Main 
                  showFavorites={false} 
                  favorites={favorites}
                  onToggleFavorite={handleToggleFavorite}
                />
              } 
            />
            <Route 
              path="/favorites" 
              element={
                <Main 
                  showFavorites={true} 
                  favorites={favorites}
                  onToggleFavorite={handleToggleFavorite}
                />
              } 
            />
          </Routes>
          <Footer />
        </>
      )}
    </div>
  );
}

export default App;
