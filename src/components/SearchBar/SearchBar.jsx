import { useState } from 'react';
import './SearchBar.css';
import Button from '../Button/Button';

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSearch = () => {
    if (query.trim() !== '') {
      onSearch(query);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && query.trim() !== '') {
      handleSearch();
    }
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="nombre, tipo o número"
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyPress}
        className="search-bar__input"
      />
      <Button 
        onClick={handleSearch} 
        className={`search-bar__button ${query.trim() === '' ? 'button--disabled' : ''}`} 
        disabled={query.trim() === ''}>
        Buscar
      </Button>
    </div>
  );
}

export default SearchBar;