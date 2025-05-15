import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Route, Routes } from 'react-router-dom';
import { getPokemonList, getPokemonImage, fetchTypePokemons } from '../../utils/MainApi';
import './Main.css';
import PokemonList from '../PokemonList/PokemonList';
import Preloader from '../Preloader/Preloader';
import Button from '../Button/Button';
import NotFound from '../NotFound/NotFound';

function Main({ favorites, onToggleFavorite, searchQuery, filter }) {
  const location = useLocation();
  const navigate = useNavigate();
  const showFavorites = location.pathname === '/favorites';
  const [pokemons, setPokemons] = useState([]);
  const [filteredPokemons, setFilteredPokemons] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [apiError, setApiError] = useState(false);

  // Cargar todos los pokémon solo una vez
  useEffect(() => {
    if (!showFavorites && pokemons.length === 0) {
      setIsSearching(true);
      getPokemonList(0, 1000)
        .then((data) => {
          const basicPokemons = data.results.map((pokemon) => {
            const id = pokemon.url.split('/')[6];
            return {
              ...pokemon,
              id,
              sprite: getPokemonImage(id),
            };
          });
          setPokemons(basicPokemons);
          setFilteredPokemons(basicPokemons);
        })
        .catch((error) => {
          setApiError(true);
          console.error('Error al cargar la lista de Pokémon:', error);
        })
        .finally(() => setIsSearching(false));
    }
    if (showFavorites) {
      setFilteredPokemons(favorites);
    }
  }, [showFavorites, favorites, pokemons.length]);

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
          return filtered.filter((pokemon) => result.pokemons.some((p) => p.name === pokemon.name));
        }
        return filtered;
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

  return (
    <main className="main">
      <section className="main__content">
        {isSearching ? (
          <div className="preloader-container">
            <Preloader />
          </div>
        ) : (
          <Routes>
            <Route
              path="/favorites"
              element={
                <>
                  {(searchQuery || showFavorites) && (
                    <Button onClick={resetToAllPokemons} className="button main__reset-button">
                      Volver a todos
                    </Button>
                  )}
                  <PokemonList 
                    showOnlyFavorites={showFavorites}
                    favorites={favorites}
                    onToggleFavorite={onToggleFavorite}
                    pokemons={filteredPokemons}
                  />
                </>
              }
            />
            <Route
              path="/"
              element={
                apiError ? (
                  <NotFound />
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
                      onToggleFavorite={onToggleFavorite}
                      pokemons={filteredPokemons}
                    />
                  </>
                )
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        )}
      </section>
    </main>
  );
}

export default Main;