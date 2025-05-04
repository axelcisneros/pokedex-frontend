import { useLocation } from 'react-router-dom';
import './Main.css';
import PokemonList from '../PokemonList/PokemonList';

function Main({ favorites, onToggleFavorite }) {
  const location = useLocation();
  const showFavorites = location.pathname === '/favorites';

  return (
    <main className="main">
      <section className="main__content">
        <PokemonList 
          showOnlyFavorites={showFavorites}
          favorites={favorites}
          onToggleFavorite={onToggleFavorite}
        />
      </section>
    </main>
  );
}

export default Main;