import { useState, useEffect } from "react";
import { Header } from "./Header";
import { UseSearch } from "./hooks/UseSearch";
import { FaTimes, FaStar, FaCalendarAlt, FaTheaterMasks, FaUserAlt } from "react-icons/fa";
import { Icon } from "./Icon";
export const MainApp = ({
  currentUser,
  handleLogout,
  setCurrentUser,
  setQuery,
}) => {
  const [activeItem, setActiveItem] = useState(null);
  const [itemDetails, setItemDetails] = useState(null);
  const [genres, setGenres] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    selectedSearch,
    setSelectedSearch,
    handleSearchQueryChange,
    searchQuery,
    queryResponse,
    getMovieDetails,
    getTvShowDetails
  } = UseSearch();

  // Cargar géneros al iniciar
  useEffect(() => {
    // Esto sería una función que trae los géneros desde la API
    // Para este ejemplo, usamos datos estáticos
    const movieGenres = [
      { id: 28, name: "Acción" },
      { id: 12, name: "Aventura" },
      { id: 16, name: "Animación" },
      { id: 35, name: "Comedia" },
      { id: 80, name: "Crimen" },
      { id: 99, name: "Documental" },
      { id: 18, name: "Drama" },
      { id: 10751, name: "Familia" },
      { id: 14, name: "Fantasía" },
      { id: 36, name: "Historia" },
      { id: 27, name: "Terror" },
      { id: 10402, name: "Música" },
      { id: 9648, name: "Misterio" },
      { id: 10749, name: "Romance" },
      { id: 878, name: "Ciencia ficción" },
      { id: 10770, name: "Película de TV" },
      { id: 53, name: "Suspense" },
      { id: 10752, name: "Bélica" },
      { id: 37, name: "Western" },
    ];
    
    setGenres(movieGenres);
  }, []);

  function getFullImageUrl(path, size = "w1280") {
    if (!path) return null;
    return `https://image.tmdb.org/t/p/${size}${path}`;
  }

  // Obtener nombres de géneros por IDs
  const getGenreNames = (genreIds) => {
    return genreIds.map(id => {
      const genre = genres.find(g => g.id === id);
      return genre ? genre.name : "";
    }).filter(name => name !== "");
  };

  // Manejar clic en un ítem
  const handleItemClick = async (item) => {
    setIsLoading(true);
    setActiveItem(item);
    
    try {
      let details;
      if (item.media_type === "movie" || selectedSearch === "movie") {
        details = await getMovieDetails(item.id);
      } else {
        details = await getTvShowDetails(item.id);
      }
      
      setItemDetails(details);
    } catch (error) {
      console.error("Error al obtener detalles:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Cerrar el modal de detalles
  const closeDetails = () => {
    setActiveItem(null);
    setItemDetails(null);
  };

  return (
    <>
      <Header
        currentUser={currentUser}
        handleLogout={handleLogout}
        handleSearchQueryChange={handleSearchQueryChange}
        selectedSearch={selectedSearch}
        setSelectedSearch={setSelectedSearch}
      />
      
      {/* Contenido principal */}
      <div className="container mx-auto px-4 py-6">
        {queryResponse && queryResponse.length > 0 && searchQuery.current === null ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {queryResponse.map((item) => (
              <div
                key={item.id}
                onClick={() => handleItemClick(item)}
                className="bg-gray-800 rounded-xl overflow-hidden shadow-lg cursor-pointer transform transition duration-300 hover:scale-105"
              >
                {item.poster_path ? (
                  <img
                    src={getFullImageUrl(item.poster_path, "w500")}
                    alt={item.title || item.name}
                    className="w-full h-64 object-cover"
                  />
                ) : (
                  <div className="bg-gray-700 w-full h-64 flex items-center justify-center">
                    <Icon name="theater" size={48} color="#FFD700" />
                  </div>
                )}
                <div className="p-4">
                  <h4 className="text-xl font-bold text-white truncate">
                    {item.title || item.name}
                  </h4>
                  <div className="flex items-center mt-2">
                    <Icon name="star" size={16} color="#FFD700" />
                    <span className="text-white">{item.vote_average?.toFixed(1)}</span>
                    <span className="text-gray-400 mx-2">|</span>
                    <Icon name="calendar" size={16} color="#FFD700" />
                    <span className="text-white">
                      {item.release_date?.substring(0, 4) || 
                       item.first_air_date?.substring(0, 4)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="bg-gray-800 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <Icon name="theater" size={48} color="#FFD700" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No hay resultados</h3>
            <p className="text-gray-400">Intenta buscar algo diferente</p>
          </div>
        )}
      </div>
      
      {/* Modal de detalles en pantalla completa */}
      {activeItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900">
          <div className="min-h-screen">
            {/* Botón de cerrar */}
            <button
              onClick={closeDetails}
              className="fixed top-4 right-4 z-50 text-white bg-red-600 hover:bg-red-700 rounded-full p-3 shadow-lg"
            >
              <FaTimes className="text-xl" />
            </button>
            
            {/* Contenido del modal */}
            <div className="relative">
              {/* Imagen de fondo con efecto de desenfoque */}
              {activeItem.backdrop_path && (
                <div className="absolute inset-0 z-0">
                  <img
                    src={getFullImageUrl(activeItem.backdrop_path, "original")}
                    alt={activeItem.title || activeItem.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
                  <div className="absolute inset-0 bg-black bg-opacity-70"></div>
                </div>
              )}
              
              {/* Contenedor principal */}
              <div className="relative z-10 pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                {isLoading ? (
                  <div className="flex justify-center items-center h-screen">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
                  </div>
                ) : (
                  itemDetails && (
                    <div className="flex flex-col lg:flex-row gap-8">
                      {/* Poster */}
                      <div className="lg:w-1/3 flex justify-center">
                        <div className="w-64 h-96 lg:w-80 lg:h-[30rem] rounded-xl overflow-hidden shadow-2xl">
                          <img
                            src={getFullImageUrl(activeItem.poster_path, "w500")}
                            alt={activeItem.title || activeItem.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      
                      {/* Detalles */}
                      <div className="lg:w-2/3 text-white">
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                          {activeItem.title || activeItem.name}
                        </h1>
                        
                        {/* Información básica */}
                        <div className="flex flex-wrap gap-4 mb-6">
                          <div className="flex items-center bg-gray-800 bg-opacity-50 px-3 py-1 rounded-full">
                            <Icon name="star" size={16} color="#FFD700" />
                            <span>{itemDetails.vote_average?.toFixed(1)}/10</span>
                          </div>
                          
                          <div className="flex items-center bg-gray-800 bg-opacity-50 px-3 py-1 rounded-full">
                            <Icon name="calendar" size={16} color="#FFD700" />
                            <span>
                              {itemDetails.release_date?.substring(0, 4) || 
                               itemDetails.first_air_date?.substring(0, 4)}
                            </span>
                          </div>
                          
                          {itemDetails.runtime && (
                            <div className="flex items-center bg-gray-800 bg-opacity-50 px-3 py-1 rounded-full">
                              <span>
                                {Math.floor(itemDetails.runtime / 60)}h {itemDetails.runtime % 60}m
                              </span>
                            </div>
                          )}
                          
                          {itemDetails.adult && (
                            <div className="flex items-center bg-red-600 bg-opacity-80 px-3 py-1 rounded-full">
                              <FaUserAlt className="mr-1" />
                              <span>+18</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Géneros */}
                        {itemDetails.genres?.length > 0 && (
                          <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-2">Géneros</h3>
                            <div className="flex flex-wrap gap-2">
                              {itemDetails.genres.map(genre => (
                                <span 
                                  key={genre.id} 
                                  className="bg-blue-600 bg-opacity-70 px-3 py-1 rounded-full"
                                >
                                  {genre.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Descripción */}
                        <div className="mb-8">
                          <h3 className="text-lg font-semibold mb-2">Sinopsis</h3>
                          <p className="text-gray-200 leading-relaxed max-w-3xl">
                            {itemDetails.overview || "Descripción no disponible."}
                          </p>
                        </div>
                        
                        {/* Información adicional */}
                        {itemDetails.production_companies?.length > 0 && (
                          <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-2">Productoras</h3>
                            <div className="flex flex-wrap gap-2">
                              {itemDetails.production_companies.map(company => (
                                <span 
                                  key={company.id} 
                                  className="bg-gray-700 bg-opacity-50 px-3 py-1 rounded"
                                >
                                  {company.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Para series */}
                        {itemDetails.number_of_seasons && (
                          <div className="flex gap-6">
                            <div>
                              <h3 className="text-lg font-semibold mb-2">Temporadas</h3>
                              <p className="text-2xl font-bold">{itemDetails.number_of_seasons}</p>
                            </div>
                            
                            {itemDetails.number_of_episodes && (
                              <div>
                                <h3 className="text-lg font-semibold mb-2">Episodios</h3>
                                <p className="text-2xl font-bold">{itemDetails.number_of_episodes}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};