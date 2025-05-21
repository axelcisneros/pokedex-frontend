import { motion } from 'framer-motion';
import './PokemonList.css';
import PokemonCard from '../PokemonCard/PokemonCard';

function PokemonList({ favorites, onToggleFavorite, pokemons, onPokemonClick }) {
  return (
    <motion.div
      className="pokemon-container"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
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
              onCardClick={onPokemonClick}
              onFavoriteClick={onToggleFavorite}
              isFavorite={Array.isArray(favorites) && favorites.some(fav => fav.name === pokemon.name)}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default PokemonList;