// src/getData.js
const API_KEY = '73759db8'; 
const BASE_URL = 'https://www.omdbapi.com/';

const RAWG_KEY = '810d5920363342b8ab0ea945c92fae8e';
const RAWG_URL = 'https://api.rawg.io/api/games';


// 1. FUNCIÓN AUXILIAR: Obtener detalles de una película por su ID
const getMovieDetails = async (imdbID) => {
    try {
        // Hacemos fetch usando el ID ('i')
        const response = await fetch(`${BASE_URL}?i=${imdbID}&apikey=${API_KEY}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error obteniendo detalle para ${imdbID}:`, error);
        return null;
    }
};

// 2. FUNCIÓN PRINCIPAL: Busca y combina datos
export const searchMoviesWithRatings = async (searchTerm, type = 'movie') => {
  if (!searchTerm || searchTerm.length < 2) {
      return [];
  }

  try {
    const response = await fetch(`${BASE_URL}?s=${searchTerm}&apikey=${API_KEY}&type=${type}`);
    const data = await response.json();

    if (data.Response !== 'True' || !data.Search) {
        return [];
    }

    const moviesFound = data.Search;
    const detailsPromises = moviesFound.map(movie => getMovieDetails(movie.imdbID));
    const detailsResults = await Promise.all(detailsPromises);

    const moviesComplete = moviesFound.map((movie, index) => {
        const details = detailsResults[index];
        
        return {
            ...movie, 
            rating: details ? details.imdbRating : "N/A", 
            overview: details ? details.Plot : "Sin descripción disponible." // 
        };
    });

    return moviesComplete;

  } catch (error) {
    console.error("Error general en la búsqueda:", error);
    return [];
  }
};

//////////////////////////RAWG API///////////////////////////
const searchRawg = async (searchTerm) => {
    try {
        // RAWG busca por defecto por relevancia
        const response = await fetch(`${RAWG_URL}?key=${RAWG_KEY}&search=${searchTerm}`);
        const data = await response.json();

        if (!data.results) return [];

        // ¡NORMALIZACIÓN! Convertimos los datos de RAWG al formato que usa Card
        return data.results.map(game => ({
            imdbID: game.id, 
            Title: game.name, 
            Year: game.released ? game.released.substring(0, 4) : 'N/A', 
            Poster: game.background_image, 
            rating: game.metacritic || game.rating,
            overview: game.genres ? `Géneros: ${game.genres.map(g => g.name).join(', ')}` : "Sin info extra"
        }));

    } catch (error) {
        console.error("Error RAWG:", error);
        return [];
    }
};

export const searchUniversal = async (searchTerm, type) => {
    if (!searchTerm || searchTerm.length < 2) return [];

    // SI EL TIPO ES 'game', USAMOS RAWG
    if (type === 'game') {
        return await searchRawg(searchTerm);
    } 
    // SI NO, USAMOS OMDB (movie, series, episode)
    else {
        return await searchOmdb(searchTerm, type);
    }
};