import { useState, useEffect } from 'react';
import './Header.css';
import Navigation from '../Navigation/Navigation';
import SearchBar from '../SearchBar/SearchBar';
import Select from '../Select/Select';
import { getFilterData } from '../../utils/pokeapi';

function Header({ onSearch, onFilter }) {
  const [types, setTypes] = useState([]);
  const [generations, setGenerations] = useState([]);

  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        const { types, generations } = await getFilterData();
        setTypes(types);
        setGenerations(generations);
      } catch (error) {
        console.error('Error fetching filter data:', error);
      }
    };

    fetchFilterData();
  }, []);

  const handleFilterChange = (e, filterType) => {
    const value = e.target.value;
    onFilter((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      if (!updatedFilters[filterType]) {
        updatedFilters[filterType] = [];
      }
      if (value) {
        if (!updatedFilters[filterType].includes(value)) {
          updatedFilters[filterType] = [...updatedFilters[filterType], value];
        }
      } else {
        updatedFilters[filterType] = [];
      }
      return updatedFilters;
    });
  };

  return (
    <header className="header">
      <div className="header__container">
        <h1 className="header__title">Pokédex</h1>
        <SearchBar onSearch={onSearch} />
        <div className="header__filters">
          <Select
            options={types.map((type) => ({ value: type.name, label: type.name }))}
            onChange={(e) => handleFilterChange(e, 'types')}
            placeholder="Filtrar por tipo"
          />
          <Select
            options={generations.map((generation) => ({ value: generation.name, label: generation.name }))}
            onChange={(e) => handleFilterChange(e, 'generations')}
            placeholder="Filtrar por generación"
          />
        </div>
        <Navigation />
      </div>
    </header>
  );
}

export default Header;