const BASE_URL = 'https://pokeapi.co/api/v2';
const SPRITE_URL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/';

export const getPokemonList = async (offset = 0, limit = 12) => {
  try {
    const response = await fetch(`${BASE_URL}/pokemon?offset=${offset}&limit=${limit}`);
    if (!response.ok) throw new Error('Error en la petición');
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const getPokemonDetails = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/pokemon/${id}`);
    if (!response.ok) throw new Error('Error en la petición');
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const getPokemonImage = (id) => {
  return `${SPRITE_URL}${id}.png`;
};