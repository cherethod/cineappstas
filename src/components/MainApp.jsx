import { useRef } from "react";
import { Header } from "./Header";
import { UseSearch } from "./hooks/UseSearch";

export const MainApp = ({
  currentUser,
  handleLogout,
  setCurrentUser,
  setQuery,
}) => {
  const {
    selectedSearch,
    setSelectedSearch,
    handleSearchQueryChange,
    searchQuery,
    searchMovies,
    searchTvShows,
    getMovieDetails,
    getTvShowDetails,
    getPopularMovies,
    getPopularTvShows,
    queryResponse,
  } = UseSearch();

  function getFullImageUrl(path, size = 'w500') {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

  return (
    <>
      <Header
        currentUser={currentUser}
        handleLogout={handleLogout}
        handleSearchQueryChange={handleSearchQueryChange}
        selectedSearch={selectedSearch}
        setSelectedSearch={setSelectedSearch}
      />
      <h3>Aqui tus series y peliculas por ver</h3>
      {
        queryResponse && queryResponse.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
            {queryResponse.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded shadow">
                <h4 className="text-xl font-bold">{item.title || item.name}</h4>
                <p>{item.overview}</p>
                <img
                  src={getFullImageUrl(item.poster_path)}
                  alt={item.title || item.name}
                  className="w-full h-auto rounded mt-2"
                />
              </div>
            ))}
          </div>
        ) : (
          <p>No hay resultados para mostrar.</p>
        )
      }
    </>
  );
};
