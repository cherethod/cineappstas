import { Icon } from "./Icon"

export const CardModal = ({ getFullImageUrl, activeItem, getGenreNames }) => {
    return (
    
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
                        <span className="ml-1">{activeItem.vote_average?.toFixed(1)}/10</span>
                      </div>
                      
                      <div className="flex items-center bg-gray-800 bg-opacity-50 px-3 py-1 rounded-full">
                        <Icon name="calendar" size={16} color="#FFD700" />
                        <span className="ml-1">
                          {activeItem.release_date?.substring(0, 4) || 
                           activeItem.first_air_date?.substring(0, 4)}
                        </span>
                      </div>
                      
                      {activeItem.adult && (
                        <div className="flex items-center bg-red-600 bg-opacity-80 px-3 py-1 rounded-full">
                          <Icon name="user" size={16} color="#fff" />
                          <span className="ml-1">+18</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Géneros */}
                    {activeItem.genre_ids && activeItem.genre_ids.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">Géneros</h3>
                        <div className="flex flex-wrap gap-2">
                          {getGenreNames(activeItem.genre_ids).map((genre, index) => (
                            <span 
                              key={index} 
                              className="bg-blue-600 bg-opacity-70 px-3 py-1 rounded-full"
                            >
                              {genre}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Descripción */}
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold mb-2">Sinopsis</h3>
                      <p className="text-gray-200 leading-relaxed max-w-3xl">
                        {activeItem.overview || "Descripción no disponible."}
                      </p>
                    </div>
                    
                    {/* Información adicional */}
                    {activeItem.media_type === "tv" && (
                      <div className="flex gap-6">
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Tipo</h3>
                          <p className="text-2xl font-bold">Serie</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
    )
}