import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './PopupWithForm.css';
import { getPokemonDetails } from '../../utils/MainApi';
import Preloader from '../Preloader/Preloader';

function PopupWithForm({ isOpen, onClose, pokemonUrl, onNavigate }) {
  const [pokemonData, setPokemonData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && pokemonUrl) {
      const pokemonId = pokemonUrl.split('/')[6];
      loadPokemonDetails(pokemonId);
    }
  }, [isOpen, pokemonUrl]);

  const loadPokemonDetails = async (pokemonId) => {
    try {
      setIsLoading(true);
      const data = await getPokemonDetails(pokemonId);
      setPokemonData(data);
      setError(null);
    } catch (error) {
      console.error('Error al cargar detalles del Pokémon:', error);
      setError('Error al cargar los detalles del Pokémon');
    } finally {
      setIsLoading(false);
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

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('popup-open');
    } else {
      document.body.classList.remove('popup-open');
    }
    return () => document.body.classList.remove('popup-open');
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="popup-overlay"
          onClick={handleOverlayClick}
        >
          <button className="popup-nav prev" onClick={() => onNavigate('prev')}>&lt;</button>
          {isLoading ? (
            <div className="popup-loading">
              <Preloader />
            </div>
          ) : (
            <motion.div
              className="popup-content"
            >
              <button className="popup-close" onClick={onClose}>&times;</button>
              <AnimatePresence mode="wait">
                {error ? (
                  <motion.div 
                    className="popup-error"
                    key="error"
                  >
                    {error}
                  </motion.div>
                ) : pokemonData && (
                  <motion.div 
                    className="pokemon-details"
                    key="content"
                  >
                    <div className="pokemon-header">
                      <h2>{pokemonData.name}</h2>
                      <span>#{pokemonData.id.toString().padStart(3, '0')}</span>
                    </div>
                    
                    <motion.div 
                      className="popup-image-container"
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
                          >
                            {type.type.name}
                          </motion.span>
                        ))}
                      </div>

                      <div className="pokemon-stats">
                        {pokemonData.stats.map((stat) => (
                          <motion.div 
                            key={stat.stat.name} 
                            className="stat-row"
                          >
                            <span className="stat-name">{stat.stat.name}</span>
                            <div className="stat-bar-container">
                              <motion.div 
                                className="stat-bar"
                                style={{ width: `${(stat.base_stat / 255) * 100}%` }}
                              />
                            </div>
                            <span className="stat-value">{stat.base_stat}</span>
                          </motion.div>
                        ))}
                      </div>

                      <motion.div 
                        className="pokemon-abilities"
                      >
                        <h3>Habilidades</h3>
                        <div className="abilities-list">
                          {pokemonData.abilities.map((ability) => (
                            <motion.span 
                              key={ability.ability.name} 
                              className="ability-badge"
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
          )}
          <button className="popup-nav next" onClick={() => onNavigate('next')}>&gt;</button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default PopupWithForm;