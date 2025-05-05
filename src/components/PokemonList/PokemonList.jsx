import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './PokemonList.css';
import PokemonCard from '../PokemonCard/PokemonCard';
import Preloader from '../Preloader/Preloader';
import PopupWithForm from '../PopupWithForm/PopupWithForm';

function PokemonList({ favorites, onToggleFavorite, pokemons }) {
  const [popupLoading, setPopupLoading] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState(null);

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

  const handleNavigate = (direction) => {
    if (!selectedPokemon) return;

    const currentIndex = pokemons.findIndex(
      (pokemon) => pokemon.name === selectedPokemon.name
    );

    let newIndex;
    if (direction === 'prev') {
      newIndex = (currentIndex - 1 + pokemons.length) % pokemons.length;
    } else if (direction === 'next') {
      newIndex = (currentIndex + 1) % pokemons.length;
    }

    setSelectedPokemon(pokemons[newIndex]);
  };

  return (
    <motion.div
      className="pokemon-container"
      initial={{ opacity: 1 }}
      animate={{ opacity: selectedPokemon ? 0.5 : 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="pokemon-grid">
        {pokemons.map((pokemon, index) => (
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
              isFavorite={Array.isArray(favorites) && favorites.some(fav => fav.name === pokemon.name)}
            />
          </motion.div>
        ))}
      </div>

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
                onNavigate={handleNavigate}
              />
            )}
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default PokemonList;