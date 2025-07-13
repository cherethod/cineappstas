import { SearchButtons } from "./SearchButtons";

export const Header = ({ currentUser, handleLogout, selectedSearch, setSelectedSearch, searchQuery, handleSearchQueryChange }) => {

  return (
    <header className="w-full min-h-20 flex items-center bg-indigo-900 text-white">
      <h1 className="text-5xl font-bold justify-self-center ml-6">
        CineAppstas
      </h1>
      <form className="mx-auto max-w-4xl w-full ">
        <div className="flex w-full gap-4 items-center text-2xl">
          <label htmlFor="buscar">Buscar: </label>
          <input
            ref={searchQuery}
            name="buscar"
            id="buscar"
            className="w-full bg-sky-200 text-black px-2 py-2 rounded"
            type="text"
            placeholder={`Introduce el título de la ${
              selectedSearch == "movies" ? "pelicula" : "serie"
            }

            `}
            onChange={(e) => handleSearchQueryChange(e)}
          />
          <SearchButtons
            selectedSearch={selectedSearch}
            setSelectedSearch={setSelectedSearch}
          />
        </div>
      </form>
      <div className="flex items-center gap-4 ml-auto mr-6 ">
        <img
          src={currentUser.avatar_url}
          alt={currentUser.username}
          className="w-12 h-12 rounded-full"
        />
        <span className="text-lg">{currentUser.username}</span>
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600"
        >
          Cerrar sesión
        </button>
      </div>
    </header>
  );
};
