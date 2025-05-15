// src/utils/MainApi.js
// Centraliza las llamadas al backend propio para autenticación y datos de Pokémon

const BASE_URL = 'https://api-pokedex-20x0.onrender.com'; // Cambia por el endpoint de tu backend si es necesario

export const register = async (name, email, password) => {
  const res = await fetch(`${BASE_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });
  return res.json();
};

export const login = async (email, password) => {
  const res = await fetch(`${BASE_URL}/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return res.json();
};

export const getCurrentUser = async (token) => {
  const res = await fetch(`${BASE_URL}/users/me`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return res.json();
};

export const getPokemons = async (token) => {
  const res = await fetch(`${BASE_URL}/pokemons`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return res.json();
};

export const getPokemonList = async (offset = 0, limit = 12) => {
  const res = await fetch(`${BASE_URL}/pokemons/external/list?offset=${offset}&limit=${limit}`);
  return res.json();
};

export const getPokemonDetails = async (id) => {
  const res = await fetch(`${BASE_URL}/pokemons/external/${id}`);
  return res.json();
};

export const getPokemonImage = (id) => {
  return `${BASE_URL}/pokemons/external/${id}/sprite`;
};

export const getHighQualitySprite = (id) => {
  return `${BASE_URL}/pokemons/external/${id}/official-artwork`;
};

export const fetchTypePokemons = async (types = []) => {
  const query = types && types.length ? `?types=${types.join(',')}` : '';
  const res = await fetch(`${BASE_URL}/pokemons/external/types/filter${query}`);
  return res.json();
};

export const getFilterData = async () => {
  const res = await fetch(`${BASE_URL}/pokemons/external/types`);
  return res.json();
};

// Agrega aquí más funciones según los endpoints de tu backend
