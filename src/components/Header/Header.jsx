import { useState, useContext } from 'react';
import './Header.css';
import Navigation from '../Navigation/Navigation';
import SearchBar from '../SearchBar/SearchBar';
import Select from '../Select/Select';
import UserContext from '../../context/UserContext';
import LoginRegister from '../Auth/LoginRegister';

const POKEMON_TYPES = [
  'normal', 'fighting', 'flying', 'poison', 'ground', 'rock', 'bug', 'ghost', 'steel',
  'fire', 'water', 'grass', 'electric', 'psychic', 'ice', 'dragon', 'dark', 'fairy', 'unknown', 'shadow'
];

function Header({ onSearch, onFilter }) {
  const [showAuth, setShowAuth] = useState(false);
  const { user, isLoggedIn, setIsLoggedIn, setUser, setToken } = useContext(UserContext);

  const handleFilterChange = (e, filterType) => {
    const value = e.target.value;
    onFilter((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      if (!updatedFilters[filterType]) {
        updatedFilters[filterType] = [];
      }
      if (value) {
        updatedFilters[filterType] = [value];
      } else {
        updatedFilters[filterType] = [];
      }
      return updatedFilters;
    });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setToken('');
    localStorage.removeItem('jwt');
  };

  return (
    <header className="header">
      <div className="header__container">
        <h1 className="header__title">Pokédex</h1>
        <SearchBar onSearch={onSearch} />
        <div className="header__filters">
          <Select
            options={POKEMON_TYPES.map((type) => ({ value: type, label: type }))}
            onChange={(e) => handleFilterChange(e, 'types')}
            placeholder={"Filtrar por tipo"}
            disabled={false}
          />
        </div>
        <Navigation />
        <div className="header__auth">
          {isLoggedIn ? (
            <>
              <span className="header__user">Hola, {user?.name || user?.email}</span>
              <button className="header__logout" onClick={handleLogout}>Cerrar sesión</button>
            </>
          ) : (
            <button className="header__login" onClick={() => setShowAuth(true)}>Iniciar sesión</button>
          )}
        </div>
        {showAuth && <LoginRegister onClose={() => setShowAuth(false)} />}
      </div>
    </header>
  );
}

export default Header;