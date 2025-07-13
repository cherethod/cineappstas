const API_URL = import.meta.env.VITE_TMDB_API_URL;
const API_KEY = "101b8bbd07d3fc2a91973268425ead18"
const API_TOKEN = import.meta.env.VITE_TMDB_API_TOKEN;

// Verificar que las variables están definidas
if (!API_KEY || API_KEY === "undefined") {
  throw new Error("Falta la API key de TMDb. Verifica tus variables de entorno.");
}

export async function makeRequest(endpoint, params = {}) {
  const queryParams = new URLSearchParams({
    api_key: API_KEY,
    language: 'es-ES',
    ...params
  });

  const url = `${API_URL}${endpoint}?${queryParams}`;
  
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: API_TOKEN ? `Bearer ${API_TOKEN}` : "",
    },
  };

  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      // Leer el cuerpo de la respuesta para más detalles del error
      const errorBody = await response.text();
      throw new Error(`Error ${response.status}: ${response.statusText} | ${errorBody}`);
    }
    console.log(response.json());
    
    return await response.json();
  } catch (error) {
    console.error(`Error en ${endpoint}:`, error.message);
    throw error;
  }
}

// Buscar películas
export async function searchMovies(query, page = 1) {
  return makeRequest('search/movie', {
    query: query,
    page: page,
    include_adult: false
  });
}

// Buscar series
export async function searchTvShows(query, page = 1) {
  return makeRequest('search/tv', {
    query: query,
    page: page,
    include_adult: false
  });
}