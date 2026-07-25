"use client";

// Update the component signature and props interface like this:
export default function Hero({ movie, onSelectMovie }: { movie: any; onSelectMovie: (movie: any) => void }) {
  if (!movie) return null;

  return (
    <div className="relative h-[75vh] md:h-[85vh] w-full select-none">
      <div className="absolute inset-0">
        <img 
          src={movie.heroBannerUrl || movie.thumbnailUrl} 
          alt={movie.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/40 to-black/60" />
      </div>

      <div className="absolute bottom-20 left-6 md:left-12 max-w-xl space-y-4 z-10">
        <h1 className="text-4xl md:text-6xl font-black drop-shadow-lg text-white">
          {movie.title}
        </h1>
        <p className="text-sm md:text-base text-gray-200 line-clamp-3 drop-shadow">
          {movie.synopsis || movie.description}
        </p>

        <div className="flex space-x-4 pt-2">
          <button 
            onClick={() => onSelectMovie(movie)}
            className="bg-white hover:bg-gray-200 text-black font-bold px-8 py-3.5 rounded-xl transition flex items-center space-x-2 shadow-lg outline-none cursor-pointer"
          >
            <span>▶ Play</span>
          </button>
          <button 
            onClick={() => onSelectMovie(movie)}
            className="bg-zinc-800/80 hover:bg-zinc-700 text-white font-bold px-8 py-3.5 rounded-xl transition backdrop-blur-md border border-zinc-700 outline-none cursor-pointer"
          >
            More Info
          </button>
        </div>
      </div>
    </div>
  );
}
