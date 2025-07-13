import { useState, useEffect } from "react";
import { Header } from "./Header";
import { UseSearch } from "./hooks/UseSearch";
import { Icon } from "./Icon";

export const MainApp = ({
  currentUser,
  handleLogout,
  setCurrentUser,
  setQuery,
}) => {
  const [activeItem, setActiveItem] = useState(null);
  const [genres, setGenres] = useState([]);
  
  const {
    selectedSearch,
    setSelectedSearch,
    handleSearchQueryChange,
    searchQuery,
    queryResponse,
  } = UseSearch();

  // Cargar géneros al iniciar
  useEffect(() => {
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
    if (!genreIds) return [];
    return genreIds.map(id => {
      const genre = genres.find(g => g.id === id);
      return genre ? genre.name : "";
    }).filter(name => name !== "");
  };

  // Cerrar el modal de detalles
  const closeDetails = () => {
    setActiveItem(null);
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
        {queryResponse && queryResponse.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {queryResponse.map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveItem(item)}
                className="bg-gray-800 rounded-xl overflow-hidden shadow-lg cursor-pointer transform transition duration-300 hover:scale-105"
              >
                {item.poster_path ? (
                  <img
                    src={getFullImageUrl(item.poster_path, "w500")}
                    alt={item.title || item.name}
                    className="w-full h-full object-contain"
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
                    <span className="text-white ml-1">{item.vote_average?.toFixed(1)}</span>
                    <span className="text-gray-400 mx-2">|</span>
                    <Icon name="calendar" size={16} color="#FFD700" />
                    <span className="text-white ml-1">
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
        <div 
          className="fixed inset-0 z-50 overflow-y-auto bg-gray-900"
          onClick={closeDetails}
        >
          <div className="min-h-screen" onClick={e => e.stopPropagation()}>
            {/* Botón de cerrar */}
            <button
              onClick={closeDetails}
              className="fixed top-4 right-4 z-50 text-white bg-red-600 hover:bg-red-700 rounded-full p-3 shadow-lg"
            >
              <Icon name="close" size={24} color="white" />
            </button>
            
            {/* Contenido del modal */}
          <CardModal getFullImageUrl={getFullImageUrl} activeItem={activeItem} getGenreNames={getGenreNames} /> 
          </div>
        </div>
      )}
    </>
  );
};