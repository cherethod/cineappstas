export const SearchButtons = ({ selectedSearch, setSelectedSearch }) => {
    return  (
        <>
          <div
            className={`px-4 py-2 ${selectedSearch == 'movies' ? 'bg-indigo-200' : 'bg-indigo-400'} text-white rounded hover:bg-indigo-300 cursor-pointer`}
            onClick={() => setSelectedSearch('movies')}
          >
            Peliculas
          </div>
          <div
            className={`px-4 py-2 ${selectedSearch == 'series' ? 'bg-indigo-200' : 'bg-indigo-400'} text-white rounded hover:bg-indigo-300 cursor-pointer`}
            onClick={() => setSelectedSearch('series')}
          >
            Series
          </div>
          </>
    )
}