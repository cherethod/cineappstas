import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";

const API_URL =
  import.meta.env.VITE_TMDB_API_URL || "https://api.themoviedb.org/3/";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_TOKEN = import.meta.env.VITE_TMDB_API_TOKEN;

export const UseSearch = () => {
  const [selectedSearch, setSelectedSearch] = useState("movies");
  const [queryResponse, setQueryResponse] = useState(null);
  const searchQuery = useRef(null);

  const handleSearchQueryChange = (e) => {
    e.preventDefault();
    searchQuery.current.value = e.target.value;
    console.log(`Buscando: ${searchQuery.current.value}`);
  };

  useEffect(() => {
    if (!searchQuery.current === null) return;
    console.log(`Iniciando búisqueda de contenido popular`);
    
    if (selectedSearch === "movies") {
      getPopularMovies()
        .then((data) => {
          console.log("Películas populares:", data);
            setQueryResponse(...data.results);
        })
        .catch((error) => {
          console.error("Error obteniendo películas populares:", error);
        });
    } else if (selectedSearch === "series") {
      getPopularTvShows()
        .then((data) => {
          console.log("Series populares:", data);
            setQueryResponse(...data.results);
        })
        .catch((error) => {
          console.error("Error obteniendo series populares:", error);
        });
    }
  }, [selectedSearch, searchQuery]);

  // Función genérica para hacer peticiones
  async function makeRequest(endpoint, params = {}) {
    console.log(`Haciendo petición a ${endpoint} con parámetros:`, params);
    
    try {
      // Agregar API_KEY a todos los requests
      const queryParams = new URLSearchParams({
        api_key: API_KEY,
        language: "es-ES", // Configuración regional en español
        ...params,
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
    console.log("Buscando películas con término:", query);
    return makeRequest("search/movie", {
      query: query,
      page: page,
      include_adult: false,
    });
  }

  // Buscar series por término
  async function searchTvShows(query, page = 1) {
    console.log("Buscando series con término:", query);
    return makeRequest("search/tv", {
      query: query,
      page: page,
      include_adult: false,
    });
  }

  // Obtener detalles de una película por ID
  async function getMovieDetails(movieId) {
    console.log("Obteniendo detalles de la película con ID:", movieId);
    return makeRequest(`movie/${movieId}`, {
      append_to_response: "videos,credits,similar",
    });
  }

  // Obtener detalles de una serie por ID
  async function getTvShowDetails(tvId) {
    console.log("Obteniendo detalles de la serie con ID:", tvId);
    return makeRequest(`tv/${tvId}`, {
      append_to_response: "videos,credits,similar",
    });
  }

  // Obtener películas populares
  async function getPopularMovies(page = 1) {
    console.log("Obteniendo películas populares...");
    return makeRequest("movie/popular", { page });
  }

  // Obtener series populares
  async function getPopularTvShows(page = 1) {
    console.log("Obteniendo series populares...");
    return makeRequest("tv/popular", { page });
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
    getPopularTvShows,
    queryResponse
  };
};
