import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './PokemonList.css';
import { getPokemonList } from '../../utils/PokeApi';
import PokemonCard from '../PokemonCard/PokemonCard';
import Preloader from '../Preloader/Preloader';
import PopupWithForm from '../PopupWithForm/PopupWithForm';

function PokemonList({ showOnlyFavorites, favorites, onToggleFavorite }) {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [popupLoading, setPopupLoading] = useState(false);
  const [error, setError] = useState(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const limit = 12;

  const loadPokemons = useCallback(async () => {
    if (showOnlyFavorites) {
      setPokemons(favorites);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getPokemonList(offset, limit);
      
      if (!data.next) {
        setHasMore(false);
      }

      setPokemons(prevPokemons => {
        const newPokemons = data.results.filter(
          newPokemon => !prevPokemons.some(
            existingPokemon => existingPokemon.name === newPokemon.name
          )
        );
        return [...prevPokemons, ...newPokemons];
      });
      
      setError(null);
    } catch (error) {
      console.error('Error al cargar pokémons:', error);
      setError('Lo sentimos, algo ha salido mal durante la solicitud. Por favor, inténtalo más tarde.');
    } finally {
      // Agregar delay al preloader
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  }, [offset, showOnlyFavorites, favorites, limit]);

  useEffect(() => {
    loadPokemons();
  }, [loadPokemons]);

  const handleLoadMore = () => {
    setOffset(prevOffset => prevOffset + limit);
  };

  const handlePokemonClick = (pokemon) => {
    setSelectedPokemon(pokemon);
    setPopupLoading(true);
    // Simular tiempo de carga para el popup
    setTimeout(() => {
      setPopupLoading(false);
    }, 5000);
  };

  const handleClosePopup = () => {
    setSelectedPokemon(null);
  };

  if (error) {
    return <div className="pokemon-error">{error}</div>;
  }

  const displayedPokemons = showOnlyFavorites ? favorites : pokemons;

  return (
    <div className="pokemon-container">
      <AnimatePresence>
        {loading && (
          <motion.div 
            className="pokemon-loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Preloader />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pokemon-grid">
        {displayedPokemons.map((pokemon, index) => (
          <motion.div
            key={pokemon.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <PokemonCard 
              pokemon={pokemon}
              onCardClick={handlePokemonClick}
              onFavoriteClick={onToggleFavorite}
              isFavorite={favorites.some(fav => fav.name === pokemon.name)}
            />
          </motion.div>
        ))}
      </div>
      
      {!loading && !showOnlyFavorites && hasMore && (
        <motion.button 
          className="load-more-button"
          onClick={handleLoadMore}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Mostrar más
        </motion.button>
      )}

      <AnimatePresence>
        {selectedPokemon && (
          <>
            {popupLoading ? (
              <motion.div 
                className="popup-loading-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Preloader />
              </motion.div>
            ) : (
              <PopupWithForm
                isOpen={true}
                onClose={handleClosePopup}
                pokemonUrl={selectedPokemon?.url}
              />
            )}
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default PokemonList;