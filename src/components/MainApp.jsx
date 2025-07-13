import { Header } from "./Header";
import { UseSearch } from "./hooks/UseSearch";

export const MainApp = ({
  currentUser,
  handleLogout,
  setCurrentUser,
  setQuery,
}) => {
  const [activeTitle, setActiveTitle] = useState(null);
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

  function getFullImageUrl(path, size = "w500") {
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
      {queryResponse &&
      queryResponse.length > 0 &&
      searchQuery.current === null ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          {queryResponse.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveTitle(item)}
              className="relative bg-white p-4 rounded shadow flex flex-col h-full hover:shadow-lg hover:bg-gray-100 hover:scale-105 hover:[&>p]:opacity-100 hover:[&>p]:w-full hover:[&>p]:h-full transition-all duration-300"
            >
              <h4 className="text-xl font-bold">{item.title || item.name}</h4>
              <p className="absolute top-0 left-0 h-0 w-0 opacity-0 bg-black/70 text-white flex items-center">
                {item.overview}
              </p>
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
      )}
    </>
  );
};
