import { useState, useEffect, useContext, useRef } from 'react';
import { useLocation, useNavigate, Route, Routes } from 'react-router-dom';
import { getPokemonList, getPokemonImage, fetchTypePokemons } from '../../utils/MainApi';
import './Main.css';
import PokemonList from '../PokemonList/PokemonList';
import Preloader from '../Preloader/Preloader';
import Button from '../Button/Button';
import NotFound from '../NotFound/NotFound';
import UserContext from '../../context/UserContext';
import LoginRegister from '../Auth/LoginRegister';
import PopupWithForm from '../PopupWithForm/PopupWithForm';
import { AnimatePresence } from 'framer-motion';

function Main({ favorites, onToggleFavorite, searchQuery, filter }) {
  const { isLoggedIn } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();
  const showFavorites = location.pathname === '/favorites';
  const [pokemons, setPokemons] = useState([]);
  const [filteredPokemons, setFilteredPokemons] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [apiError, setApiError] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  // Estado para PopupWithForm y su preloader
  const [popupLoading, setPopupLoading] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const hasFetchedPokemons = useRef(false);

  // Cargar todos los pokémon solo una vez al inicio (incluso en modo Strict)
  useEffect(() => {
    if (hasFetchedPokemons.current) return;
    hasFetchedPokemons.current = true;
    setIsSearching(true);
    getPokemonList(0, 1000)
      .then((data) => {
        if (!data || !Array.isArray(data.results)) {
          setApiError(true);
          setPokemons([]);
          setFilteredPokemons([]);
          return;
        }
        const basicPokemons = data.results.map((pokemon) => {
          const id = pokemon.url.split('/')[6];
          return {
            ...pokemon,
            id,
            sprite: pokemon.sprite || getPokemonImage(id),
          };
        });
        setPokemons(basicPokemons);
        setFilteredPokemons(basicPokemons);
      })
      .catch((error) => {
        setApiError(true);
        setPokemons([]);
        setFilteredPokemons([]);
        console.error('Error al cargar la lista de Pokémon:', error);
      })
      .finally(() => setIsSearching(false));
    // Solo en el primer render
  }, []);

  // Mostrar favoritos solo si está logueado y en la ruta /favorites
  useEffect(() => {
    if (showFavorites && isLoggedIn) {
      setFilteredPokemons(favorites);
    }
  }, [showFavorites, isLoggedIn, favorites]);

  // Un solo efecto para filtrar por búsqueda y tipos
  useEffect(() => {
    if (showFavorites) {
      setFilteredPokemons(favorites);
      return;
    }
    let filtered = pokemons;
    let filterPromise = Promise.resolve(filtered);

    if (filter && filter.types && filter.types.length > 0) {
      filterPromise = fetchTypePokemons(filter.types).then((result) => {
        if (result && result.pokemons) {
          // Mapear los pokemons devueltos por el backend y agregar el sprite
          return result.pokemons.map((poke) => {
            const id = poke.url ? poke.url.split('/')[6] : poke.name;
            return {
              ...poke,
              id,
              sprite: getPokemonImage(id),
            };
          });
        }
        return [];
      });
    }

    filterPromise.then((filteredByType) => {
      let finalFiltered = filteredByType;
      if (searchQuery) {
        finalFiltered = finalFiltered.filter((pokemon) => {
          const matchesName = pokemon.name.toLowerCase().includes(searchQuery.toLowerCase());
          const matchesId = pokemon.id === searchQuery;
          return matchesName || matchesId;
        });
      }
      setFilteredPokemons(finalFiltered);
      setApiError(finalFiltered.length === 0);
    });
  }, [searchQuery, filter, pokemons, favorites, showFavorites]);

  const resetToAllPokemons = () => {
    setFilteredPokemons(pokemons);
    if (showFavorites) {
      navigate('/');
    }
  };

  // Modifica el handler de favoritos para usuarios no logueados
  const handleToggleFavoriteProtected = (pokemon) => {
    if (!isLoggedIn) {
      setShowLoginPrompt(true);
      return;
    }
    onToggleFavorite(pokemon);
  };

  const handleBackToAll = () => {
    setApiError(false);
    setFilteredPokemons(pokemons);
    navigate('/');
  };

  // Handlers para PopupWithForm
  const handlePokemonClick = (pokemon) => {
    setSelectedPokemon(pokemon);
    setPopupLoading(true);
    setTimeout(() => {
      setPopupLoading(false);
    }, 500); // Puedes ajustar el tiempo de carga simulado
  };
  const handleClosePopup = () => {
    setSelectedPokemon(null);
  };
  const handleNavigate = (direction) => {
    if (!selectedPokemon) return;
    const currentIndex = filteredPokemons.findIndex(
      (pokemon) => pokemon.name === selectedPokemon.name
    );
    let newIndex;
    if (direction === 'prev') {
      newIndex = (currentIndex - 1 + filteredPokemons.length) % filteredPokemons.length;
    } else if (direction === 'next') {
      newIndex = (currentIndex + 1) % filteredPokemons.length;
    }
    setSelectedPokemon(filteredPokemons[newIndex]);
  };

  return (
    <main className="main">
      {/* Popups y preloaders globales */}
      {showLoginPrompt && <LoginRegister onClose={() => setShowLoginPrompt(false)} />}
      {isSearching && (
        <div className="preloader-container">
          <Preloader />
        </div>
      )}
      <AnimatePresence>
        {selectedPokemon && (
          popupLoading ? (
            <div className="popup-loading-overlay">
              <Preloader />
            </div>
          ) : (
            <PopupWithForm
              isOpen={true}
              onClose={handleClosePopup}
              pokemonUrl={selectedPokemon?.url}
              onNavigate={handleNavigate}
            />
          )
        )}
      </AnimatePresence>
      <section className="main__content">
        {/* Solo el contenido principal y rutas dentro de section */}
        {!isSearching && (
          <Routes>
            <Route
              path="/favorites"
              element={(
                <>
                  {(searchQuery || showFavorites) && (
                    <Button onClick={resetToAllPokemons} className="button main__reset-button">
                      Volver a todos
                    </Button>
                  )}
                  <PokemonList 
                    showOnlyFavorites={showFavorites}
                    favorites={favorites}
                    onToggleFavorite={handleToggleFavoriteProtected}
                    pokemons={filteredPokemons}
                    onPokemonClick={handlePokemonClick}
                  />
                </>
              )}
            />
            <Route
              path="/"
              element={(
                apiError ? (
                  <NotFound onBackToAll={handleBackToAll} />
                ) : (
                  <>
                    {(searchQuery || showFavorites) && (
                      <Button onClick={resetToAllPokemons} className="button main__reset-button">
                        Volver a todos
                      </Button>
                    )}
                    <PokemonList 
                      showOnlyFavorites={showFavorites}
                      favorites={favorites}
                      onToggleFavorite={handleToggleFavoriteProtected}
                      pokemons={filteredPokemons}
                      onPokemonClick={handlePokemonClick}
                    />
                  </>
                )
              )}
            />
            <Route path="*" element={<NotFound onBackToAll={handleBackToAll} />} />
          </Routes>
        )}
      </section>
    </main>
  );
}

export default Main;