import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Route, Routes } from 'react-router-dom';
import { getPokemonList, getPokemonImage, fetchTypePokemons, fetchGenerationPokemons } from '../../utils/pokeapi';
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

  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        if (pokemons.length > 0) return;

        const data = await getPokemonList(0, 1000);
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
      } catch (error) {
        if (error.response && error.response.status >= 400 && error.response.status < 500) {
          setApiError(true);
        } else {
          console.error('Error al cargar la lista de Pokémon:', error);
        }
      }
    };

    if (!showFavorites) {
      fetchPokemons();
    } else {
      setFilteredPokemons(favorites);
    }
  }, [showFavorites, favorites, pokemons.length]);

  useEffect(() => {
    const applyFilter = async () => {
      setIsSearching(true);
      setApiError(false);

      let filtered = [];

      if (searchQuery) {
        try {
          if (showFavorites) {
            filtered = favorites.filter((pokemon) => {
              const matchesName = pokemon.name.toLowerCase().includes(searchQuery.toLowerCase());
              const matchesId = pokemon.id === searchQuery;
              return matchesName || matchesId;
            });
          } else {
            if (searchQuery.match(/^[a-zA-Z]+$/)) {
              filtered = await fetchTypePokemons(searchQuery.toLowerCase());
            } else {
              filtered = pokemons.filter((pokemon) => {
                const matchesName = pokemon.name.toLowerCase().includes(searchQuery.toLowerCase());
                const matchesId = pokemon.id === searchQuery;
                return matchesName || matchesId;
              });
            }
          }
        } catch (error) {
          if (error.response && error.response.status >= 400 && error.response.status < 500) {
            setApiError(true);
          } else {
            console.error('Error al filtrar Pokémon:', error);
          }
        }
      } else {
        filtered = showFavorites ? favorites : pokemons;
      }

      if (filtered.length === 0 && !apiError) {
        setApiError(true);
      }

      setFilteredPokemons(filtered);
      setTimeout(() => setIsSearching(false), 500);
    };

    applyFilter();
  }, [searchQuery, showFavorites, favorites, pokemons, apiError]);

  useEffect(() => {
    const applyFilter = async () => {
      setIsSearching(true);

      let filtered = pokemons;

      if (filter) {
        const { types = [], generations = [] } = filter;

        if (types.length > 0) {
          const typePokemons = await fetchTypePokemons(types);
          filtered = filtered.filter((pokemon) => typePokemons.includes(pokemon.name));
        }

        if (generations.length > 0) {
          const generationPokemons = await fetchGenerationPokemons(generations);
          filtered = filtered.filter((pokemon) => generationPokemons.includes(pokemon.name));
        }
      }

      setFilteredPokemons(filtered);
      setTimeout(() => setIsSearching(false), 500);
    };

    applyFilter();
  }, [filter, pokemons]);

  useEffect(() => {
    if (showFavorites) {
      setFilteredPokemons(favorites); // Actualizar automáticamente la lista de favoritos
    }
  }, [favorites, showFavorites]);

  // Ajustar la lógica para evitar renderizados innecesarios al agregar un favorito
  useEffect(() => {
    if (showFavorites) {
      setFilteredPokemons(favorites);
    } else if (!searchQuery && filteredPokemons.length === 0 && pokemons.length > 0) {
      setFilteredPokemons(pokemons);
    }
  // Corregir la advertencia agregando `filteredPokemons.length` a las dependencias
  }, [showFavorites, searchQuery, pokemons, favorites, filteredPokemons.length]);

  // Evitar que la lista "Todos" se actualice innecesariamente al agregar un favorito
  useEffect(() => {
    if (!showFavorites && filteredPokemons.length === 0 && pokemons.length > 0) {
      setFilteredPokemons(pokemons);
    }
  }, [showFavorites, pokemons, filteredPokemons]);

// Ajustar la función resetToAllPokemons para cambiar la ruta al regresar a la lista completa sin mover su posición
const resetToAllPokemons = () => {
  setFilteredPokemons(pokemons);
  if (showFavorites) {
    navigate('/'); // Cambiar la ruta a la lista completa
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