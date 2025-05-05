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

export const getHighQualitySprite = (id) => {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
};

export const fetchTypePokemons = async (types) => {
  try {
    const promises = types.map(async (type) => {
      const url = `${BASE_URL}/type/${type}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Error al obtener Pokémon por tipo: ${type}`);
      const data = await response.json();
      return data.pokemon.map((p) => p.pokemon.name);
    });

    const results = await Promise.all(promises);
    return results.flat();
  } catch (error) {
    console.error('Error al obtener Pokémon por tipo:', error);
    return [];
  }
};

export const getFilterData = async () => {
  try {
    const typeResponse = await fetch(`${BASE_URL}/type`);

    if (!typeResponse.ok) {
      throw new Error('Error fetching filter data');
    }

    const typeData = await typeResponse.json();

    return {
      types: typeData.results,
    };
  } catch (error) {
    console.error('Error fetching filter data:', error);
    throw error;
  }
};

export { BASE_URL };