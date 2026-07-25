"use client";

interface Movie {
  id: string;
  title: string;
  thumbnailUrl: string;
}

export default function MovieRow({ title, movies, onSelectMovie }: { title: string; movies: Movie[]; onSelectMovie: (movie: Movie) => void }) {
  return (
    <div className="px-6 md:px-12 space-y-3">
      <h2 className="text-lg md:text-xl font-bold text-gray-200 tracking-wide">{title}</h2>
      
      {/* Scrollable container with hidden scrollbars */}
      <div className="flex space-x-3 overflow-x-auto scrollbar-hide py-2 px-1">
        {movies.map((movie) => (
          <div
            key={movie.id}
            onClick={() => onSelectMovie(movie)}
            className="relative flex-none w-[220px] md:w-[280px] aspect-video bg-zinc-800 rounded-md cursor-pointer transition duration-300 ease-in-out hover:scale-105 hover:z-30 overflow-hidden group shadow-lg"
          >
            <img 
              src={movie.thumbnailUrl} 
              alt={movie.title} 
              className="w-full h-full object-cover rounded-md" 
            />
            
            {/* Hover overlay title */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3 rounded-md">
              <p className="text-sm font-semibold text-white drop-shadow">{movie.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}