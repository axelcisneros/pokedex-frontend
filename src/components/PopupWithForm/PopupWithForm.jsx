import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './PopupWithForm.css';
import { getPokemonDetails } from '../../utils/PokeApi';
import Preloader from '../Preloader/Preloader';

function PopupWithForm({ isOpen, onClose, pokemonUrl }) {
  const [pokemonData, setPokemonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && pokemonUrl) {
      const pokemonId = pokemonUrl.split('/')[6];
      loadPokemonDetails(pokemonId);
    }
  }, [isOpen, pokemonUrl]);

  const loadPokemonDetails = async (pokemonId) => {
    try {
      setLoading(true);
      const data = await getPokemonDetails(pokemonId);
      setPokemonData(data);
      setError(null);
      // Mantener el preloader visible por 5 segundos
      await new Promise(resolve => setTimeout(resolve, 5000));
    } catch (error) {
      console.error('Error al cargar detalles del Pokémon:', error);
      setError('Error al cargar los detalles del Pokémon');
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    const handleEscClose = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscClose);
    return () => document.removeEventListener('keydown', handleEscClose);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="popup-overlay"
          onClick={handleOverlayClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="popup-content"
            initial={{ scale: 0, rotate: 720 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: -720 }}
            transition={{ type: "spring", duration: 0.5 }}
          >
            <button className="popup-close" onClick={onClose}>&times;</button>
            
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div 
                  className="popup-loading"
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Preloader />
                </motion.div>
              ) : error ? (
                <motion.div 
                  className="popup-error"
                  key="error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {error}
                </motion.div>
              ) : pokemonData && (
                <motion.div 
                  className="pokemon-details"
                  key="content"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div className="pokemon-header">
                    <h2>{pokemonData.name}</h2>
                    <span>#{pokemonData.id.toString().padStart(3, '0')}</span>
                  </div>
                  
                  <motion.div 
                    className="pokemon-image-container"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.5 }}
                  >
                    <img 
                      src={pokemonData.sprites.other['official-artwork'].front_default}
                      alt={pokemonData.name}
                      className="pokemon-detail-image"
                    />
                  </motion.div>

                  <div className="pokemon-info">
                    <div className="pokemon-types">
                      {pokemonData.types.map(type => (
                        <motion.span 
                          key={type.type.name} 
                          className={`type-badge ${type.type.name}`}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          {type.type.name}
                        </motion.span>
                      ))}
                    </div>

                    <div className="pokemon-stats">
                      {pokemonData.stats.map((stat, index) => (
                        <motion.div 
                          key={stat.stat.name} 
                          className="stat-row"
                          initial={{ x: -50, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <span className="stat-name">{stat.stat.name}</span>
                          <div className="stat-bar-container">
                            <motion.div 
                              className="stat-bar"
                              initial={{ width: 0 }}
                              animate={{ width: `${(stat.base_stat / 255) * 100}%` }}
                              transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                            />
                          </div>
                          <span className="stat-value">{stat.base_stat}</span>
                        </motion.div>
                      ))}
                    </div>

                    <motion.div 
                      className="pokemon-abilities"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                    >
                      <h3>Habilidades</h3>
                      <div className="abilities-list">
                        {pokemonData.abilities.map((ability, index) => (
                          <motion.span 
                            key={ability.ability.name} 
                            className="ability-badge"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 1.2 + index * 0.1 }}
                          >
                            {ability.ability.name}
                          </motion.span>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default PopupWithForm;