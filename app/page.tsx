"use client";
import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { ref, get } from "firebase/database";
import { signOut } from "firebase/auth";
import MovieModal from "@/components/MovieModal";

export default function Dashboard() {
  const [movies, setMovies] = useState<any[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<any>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const moviesRef = ref(db, "movies");
        const snapshot = await get(moviesRef);
        
        if (snapshot.exists()) {
          const data = snapshot.val();
          const movieList = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
          }));
          setMovies(movieList);
        } else {
          setMovies([]);
        }
      } catch (err) {
        console.error("Error fetching movies:", err);
      }
    };
    fetchMovies();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = "/login";
  };

  const heroMovie = movies.length > 0 ? movies[0] : null;
  const filteredMovies = movies.filter(m => m.title?.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#141414] text-white relative selection:bg-red-600 selection:text-white">
      
      {/* --- NAVIGATION BAR --- */}
      <nav className="absolute top-0 left-0 right-0 z-40 px-8 py-6 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center space-x-8">
          <h1 className="text-red-600 font-black text-3xl tracking-tighter">GENFLIX</h1>
          <div className="hidden md:flex space-x-6 text-sm font-medium text-gray-300">
            <span className="text-white cursor-pointer hover:text-gray-400">Home</span>
            <span className="cursor-pointer hover:text-gray-400">AI Originals</span>
          </div>
        </div>

        <div className="flex items-center space-x-4 relative">
          <input 
            type="text" 
            placeholder="Search titles..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-black/60 border border-zinc-700 rounded-full px-4 py-1.5 text-sm text-white focus:outline-none focus:border-red-600 w-48 md:w-64"
          />

          <div className="relative">
            <button 
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="w-10 h-10 rounded-lg bg-red-600 flex items-center justify-center font-bold text-white shadow hover:bg-red-700 transition cursor-pointer"
            >
              U
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-[#181818] border border-zinc-800 rounded-xl shadow-2xl py-2 z-50">
                <div className="px-4 py-2 border-b border-zinc-800 text-xs text-gray-400">
                  Signed in as Admin
                </div>
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-zinc-800 transition font-medium cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* --- CINEMATIC HERO BANNER --- */}
      {heroMovie && (
        <div className="relative w-full h-[85vh] bg-black flex items-end">
          <div className="absolute inset-0">
            <img 
              src={heroMovie.thumbnailUrl || heroMovie.videoUrl} 
              alt={heroMovie.title} 
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-black/30 to-black/60" />
          </div>

          <div className="relative px-8 md:px-16 pb-16 max-w-2xl space-y-4 z-10">
            <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold uppercase rounded tracking-widest">
              Trending AI Release
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight drop-shadow-lg">
              {heroMovie.title}
            </h1>
            <p className="text-gray-300 text-sm md:text-base line-clamp-3 leading-relaxed drop-shadow">
              {heroMovie.synopsis}
            </p>
            <div className="flex space-x-4 pt-2">
              <button 
                onClick={() => setSelectedMovie(heroMovie)}
                className="flex items-center space-x-2 bg-white text-black px-8 py-3 rounded-md font-bold text-base hover:bg-gray-200 transition shadow-lg cursor-pointer"
              >
                <span>▶ Play Now</span>
              </button>
              <button 
                onClick={() => setSelectedMovie(heroMovie)}
                className="flex items-center space-x-2 bg-zinc-600/80 backdrop-blur text-white px-6 py-3 rounded-md font-bold text-base hover:bg-zinc-600 transition shadow-lg cursor-pointer"
              >
                <span>ℹ More Info</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MOVIE ROWS --- */}
      <div className="px-8 md:px-16 py-12 space-y-8">
        <h2 className="text-xl md:text-2xl font-bold tracking-wide text-gray-200">
          {searchQuery ? `Search Results (${filteredMovies.length})` : "Trending on GenFlix"}
        </h2>
        
        {filteredMovies.length === 0 ? (
          <div className="text-gray-500 py-12 text-center bg-zinc-900/40 rounded-xl border border-zinc-800">
            No titles found.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredMovies.map((movie) => (
              <div 
                key={movie.id}
                onClick={() => setSelectedMovie(movie)}
                className="group relative bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 cursor-pointer transition transform hover:scale-105 hover:shadow-2xl aspect-[16/9]"
              >
                <img 
                  src={movie.thumbnailUrl} 
                  alt={movie.title}
                  className="w-full h-full object-cover"
                  onError={(e: any) => {
                    e.target.src = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition flex flex-col justify-end p-3">
                  <p className="font-bold text-sm text-white truncate">{movie.title}</p>
                  <span className="text-[10px] text-gray-300 uppercase tracking-wider">{movie.category || "AI Feature"}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- MOVIE PLAYER MODAL --- */}
      {selectedMovie && (
        <MovieModal 
          movie={selectedMovie} 
          onClose={() => setSelectedMovie(null)} 
          onUpdateProgress={(id, time) => console.log("Progress:", id, time)} 
        />
      )}
    </div>
  );
}