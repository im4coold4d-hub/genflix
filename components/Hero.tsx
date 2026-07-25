interface Movie {
  title: string;
  synopsis: string;
  heroBannerUrl: string;
  promptUsed: string;
}

export default function Hero({ movie }: { movie: Movie }) {
  if (!movie) return null;

  return (
    <div className="relative h-[80vh] w-full bg-cover bg-center" style={{ backgroundImage: `url(${movie.heroBannerUrl})` }}>
      <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-transparent to-transparent w-1/2" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent top-1/2" />

      <div className="absolute bottom-20 left-8 md:left-12 max-w-xl space-y-4 z-10">
        <h1 className="text-5xl md:text-6xl font-bold drop-shadow-md">{movie.title}</h1>
        <p className="text-gray-300 text-sm md:text-base line-clamp-3">{movie.synopsis}</p>

        <div className="flex space-x-4 pt-2">
          <button className="bg-white text-black font-bold px-6 py-2.5 rounded hover:bg-opacity-80 transition flex items-center space-x-2">
            <span>▶ Play</span>
          </button>
          <button className="bg-gray-500/70 text-white font-bold px-6 py-2.5 rounded hover:bg-gray-500/50 transition">
            ℹ More Info
          </button>
        </div>
      </div>
    </div>
  );
}