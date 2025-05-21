import { useState, useEffect, useContext } from 'react';
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

  // PAGINACIÓN
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [filteredTotal, setFilteredTotal] = useState(0);

  // Cargar pokémon paginados (todos, filtrados, favoritos)
  useEffect(() => {
    setIsSearching(true);
    let fetchPromise;
    if (showFavorites) {
      // Paginación para favoritos
      setFilteredTotal(favorites.length);
      const start = (page - 1) * limit;
      const end = start + limit;
      setFilteredPokemons(favorites.slice(start, end));
      setIsSearching(false);
      return;
    } else if (filter && filter.types && filter.types.length > 0) {
      fetchPromise = fetchTypePokemons(filter.types).then((result) => {
        if (result && result.pokemons) {
          const pokes = result.pokemons.map((poke) => {
            const id = poke.url ? poke.url.split('/')[6] : poke.name;
            return {
              ...poke,
              id,
              sprite: poke.sprite || getPokemonImage(id),
            };
          });
          setFilteredTotal(pokes.length);
          const start = (page - 1) * limit;
          const end = start + limit;
          setFilteredPokemons(pokes.slice(start, end));
        } else {
          setFilteredPokemons([]);
          setFilteredTotal(0);
        }
      });
    } else if (searchQuery) {
      // Filtrado por búsqueda (sobre todos los pokémon cargados)
      fetchPromise = getPokemonList(0, 1000).then((data) => {
        if (!data || !Array.isArray(data.results)) {
          setFilteredPokemons([]);
          setFilteredTotal(0);
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
        const filtered = basicPokemons.filter((pokemon) => {
          const matchesName = pokemon.name.toLowerCase().includes(searchQuery.toLowerCase());
          const matchesId = pokemon.id === searchQuery;
          return matchesName || matchesId;
        });
        setFilteredTotal(filtered.length);
        const start = (page - 1) * limit;
        const end = start + limit;
        setFilteredPokemons(filtered.slice(start, end));
      });
    } else {
      // Lista completa paginada
      fetchPromise = getPokemonList((page - 1) * limit, limit).then((data) => {
        if (!data || !Array.isArray(data.results)) {
          setPokemons([]);
          setFilteredPokemons([]);
          setFilteredTotal(0);
          return;
        }
        setFilteredTotal(data.count || 0);
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
      });
    }
    Promise.resolve(fetchPromise).finally(() => setIsSearching(false));
  }, [page, limit, showFavorites, favorites, filter, searchQuery]);

  // Resetear página al cambiar de filtro, favoritos o búsqueda
  useEffect(() => {
    setPage(1);
  }, [showFavorites, filter, searchQuery]);

  // Mostrar favoritos solo si está logueado y en la ruta /favorites
  useEffect(() => {
    if (showFavorites && isLoggedIn) {
      setFilteredPokemons(favorites);
    }
  }, [showFavorites, isLoggedIn, favorites]);

  // Eliminar el efecto redundante de filtrado por búsqueda y tipos
  // useEffect(() => {
  //   if (showFavorites) {
  //     setFilteredPokemons(favorites);
  //     return;
  //   }
  //   let filtered = pokemons;
  //   let filterPromise = Promise.resolve(filtered);
  //
  //   if (filter && filter.types && filter.types.length > 0) {
  //     filterPromise = fetchTypePokemons(filter.types).then((result) => {
  //       if (result && result.pokemons) {
  //         // Mapear los pokemons devueltos por el backend y agregar el sprite
  //         return result.pokemons.map((poke) => {
  //           const id = poke.url ? poke.url.split('/')[6] : poke.name;
  //           return {
  //             ...poke,
  //             id,
  //             sprite: getPokemonImage(id),
  //           };
  //         });
  //       }
  //       return [];
  //     });
  //   }
  //
  //   filterPromise.then((filteredByType) => {
  //     let finalFiltered = filteredByType;
  //     if (searchQuery) {
  //       finalFiltered = finalFiltered.filter((pokemon) => {
  //         const matchesName = pokemon.name.toLowerCase().includes(searchQuery.toLowerCase());
  //         const matchesId = pokemon.id === searchQuery;
  //         return matchesName || matchesId;
  //       });
  //     }
  //     setFilteredPokemons(finalFiltered);
  //     setApiError(finalFiltered.length === 0);
  //   });
  // }, [searchQuery, filter, pokemons, favorites, showFavorites]);

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

  // Componente de paginación reutilizable
  const PaginationControls = ({ page, totalPages, setPage }) => (
    <div className="pagination">
      <button onClick={() => setPage(page - 1)} disabled={page === 1}>Anterior</button>
      <span>Página {page} de {totalPages}</span>
      <button onClick={() => setPage(page + 1)} disabled={page === totalPages}>Siguiente</button>
    </div>
  );

  // Paginación UI
  const totalPages = Math.max(1, Math.ceil(filteredTotal / limit));

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
          <>
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
                    {/* Paginación arriba */}
                    <PaginationControls page={page} totalPages={totalPages} setPage={setPage} />
                    <PokemonList 
                      showOnlyFavorites={showFavorites}
                      favorites={favorites}
                      onToggleFavorite={handleToggleFavoriteProtected}
                      pokemons={filteredPokemons}
                      onPokemonClick={handlePokemonClick}
                    />
                    {/* Paginación abajo */}
                    <PaginationControls page={page} totalPages={totalPages} setPage={setPage} />
                  </>
                )}
              />
              <Route
                path="*"
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
                      {/* Paginación arriba */}
                      <PaginationControls page={page} totalPages={totalPages} setPage={setPage} />
                      <PokemonList 
                        showOnlyFavorites={showFavorites}
                        favorites={favorites}
                        onToggleFavorite={handleToggleFavoriteProtected}
                        pokemons={filteredPokemons}
                        onPokemonClick={handlePokemonClick}
                      />
                      {/* Paginación abajo */}
                      <PaginationControls page={page} totalPages={totalPages} setPage={setPage} />
                    </>
                  )
                )}
              />
            </Routes>
          </>
        )}
      </section>
    </main>
  );
}

export default Main;