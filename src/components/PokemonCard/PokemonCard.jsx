import { motion } from 'framer-motion';
import './PokemonCard.css';
import { getHighQualitySprite } from '../../utils/pokeapi.js';

function PokemonCard({ pokemon, onCardClick, onFavoriteClick, isFavorite }) {
  const pokemonId = pokemon.url.split('/')[6];
  const imageUrl = getHighQualitySprite(pokemonId);

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    onFavoriteClick(pokemon);
  };

  return (
    <motion.div
      className="pokemon-card"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      onClick={() => onCardClick(pokemon)}
    >
      <button 
        className={`favorite-button ${isFavorite ? 'active' : ''}`}
        onClick={handleFavoriteClick}
        aria-label={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
      >
        <svg viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </button>

      <div className="card-image-container">
        <motion.img 
          src={imageUrl} 
          alt={pokemon.name}
          className="pokemon-image"
          initial={{ scale: 0, rotate: 360 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        />
      </div>
      <h3 className="pokemon-name">{pokemon.name}</h3>
      <span className="pokemon-number">#{pokemonId.padStart(3, '0')}</span>
    </motion.div>
  );
}

export default PokemonCard;