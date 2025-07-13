import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";

const API_URL = import.meta.env.VITE_TMDB_API_URL || 'https://api.themoviedb.org/3/';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_TOKEN = import.meta.env.VITE_TMDB_API_TOKEN;



export const UseSearch = () => {
  const [selectedSearch, setSelectedSearch] = useState("movies");
  const searchQuery = useRef(null);

  const handleSearchQueryChange = (e) => {
    e.preventDefault();
    searchQuery.current.value = e.target.value;
    console.log(`Buscando: ${searchQuery.current.value}`);
  };

  useEffect(() => {
    if (selectedSearch === "movies" && searchQuery.current === null) {
getPopularMovies().then(data => {
      console.log('Películas populares:', data);    

    }   ).catch(error => {
      console.error('Error obteniendo películas populares:', error);    
    });
    } else if (selectedSearch === "series" && searchQuery.current === null) {
        getPopularTvShows().then(data => {
            console.log('Series populares:', data);
        }).catch(error => {
            console.error('Error obteniendo series populares:', error);
        });
        }
    }, [selectedSearch, searchQuery]);

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
 async function searchMovies(query, page = 1) {
  return makeRequest('search/movie', {
    query: query,
    page: page,
    include_adult: false
  });
}

// Buscar series por término
 async function searchTvShows(query, page = 1) {
  return makeRequest('search/tv', {
    query: query,
    page: page,
    include_adult: false
  });
}

// Obtener detalles de una película por ID
 async function getMovieDetails(movieId) {
  return makeRequest(`movie/${movieId}`, {
    append_to_response: 'videos,credits,similar'
  });
}

// Obtener detalles de una serie por ID
 async function getTvShowDetails(tvId) {
  return makeRequest(`tv/${tvId}`, {
    append_to_response: 'videos,credits,similar'
  });
}

// Obtener películas populares
 async function getPopularMovies(page = 1) {
  return makeRequest('movie/popular', {page});
}

// Obtener series populares
 async function getPopularTvShows(page = 1) {
  return makeRequest('tv/popular', {page});
}

  return {
    selectedSearch,
    setSelectedSearch,
    searchQuery,
    handleSearchQueryChange,
    searchMovies,
    searchTvShows,
    getMovieDetails,
    getTvShowDetails,
    getPopularMovies,
    getPopularTvShows
  };
}