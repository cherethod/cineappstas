const API_URL = import.meta.env.VITE_TMDB_API_URL || 'https://api.themoviedb.org/3/';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_TOKEN = import.meta.env.VITE_TMDB_API_TOKEN;

// Función genérica para hacer peticiones
async function makeRequest(endpoint, params = {}) {
  try {
    // Agregar API_KEY a todos los requests
    const queryParams = new URLSearchParams({
      api_key: API_KEY,
      language: 'es-ES', // Configuración regional en español
      ...params
    });

    const url = `${API_URL}${endpoint}?${queryParams}`;
    
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: API_TOKEN ? `Bearer ${API_TOKEN}` : undefined,
      },
    };

    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error en ${endpoint}:`, error);
    throw error;
  }
}

// Buscar películas por término
export async function searchMovies(query, page = 1) {
  return makeRequest('search/movie', {
    query: query,
    page: page,
    include_adult: false
  });
}

// Buscar series por término
export async function searchTvShows(query, page = 1) {
  return makeRequest('search/tv', {
    query: query,
    page: page,
    include_adult: false
  });
}

// Obtener detalles de una película por ID
export async function getMovieDetails(movieId) {
  return makeRequest(`movie/${movieId}`, {
    append_to_response: 'videos,credits,similar'
  });
}

// Obtener detalles de una serie por ID
export async function getTvShowDetails(tvId) {
  return makeRequest(`tv/${tvId}`, {
    append_to_response: 'videos,credits,similar'
  });
}

// Obtener películas populares
export async function getPopularMovies(page = 1) {
  return makeRequest('movie/popular', {page});
}

// Obtener series populares
export async function getPopularTvShows(page = 1) {
  return makeRequest('tv/popular', {page});
}