"use client";
import { useState, useEffect } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
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
        const querySnapshot = await getDocs(collection(db, "movies"));
        const movieList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMovies(movieList);
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

  // Featured movie for the hero banner (defaults to the first movie)
  const heroMovie = movies.length > 0 ? movies[0] : null;
  const filteredMovies = movies.filter(m => m.title?.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#141414] text-white font-sans selection:bg-red-600 selection:text-white">
      
      {/* --- NAVIGATION BAR --- */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-b from-black/80 via-black/40 to-transparent px-8 py-4 flex items-center justify-between backdrop-blur-sm">
        <div className="flex items-center space-x-8">
          <h1 className="text-red-600 font-extrabold text-3xl tracking-tighter cursor-pointer">GENFLIX</h1>
          <div className="hidden md:flex space-x-6 text-sm font-medium text-gray-300">
            <span className="text-white cursor-pointer hover:text-gray-400 transition">Home</span>
            <span className="cursor-pointer hover:text-gray-400 transition">AI Originals</span>
            <span className="cursor-pointer hover:text-gray-400 transition">My List</span>
          </div>
        </div>

        <div className="flex items-center space-x-4 relative">
          <input 
            type="text" 
            placeholder="Search titles..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-black/50 border border-zinc-700 rounded-full px-4 py-1.5 text-sm text-white focus:outline-none focus:border-red-600 transition w-48 md:w-64"
          />

          {/* User Profile / Logout Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="w-10 h-10 rounded-lg bg-red-600 flex items-center justify-center font-bold text-white shadow-lg hover:bg-red-700 transition cursor-pointer"
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
        <div className="relative w-full h-[85vh] bg-black">
          <div className="absolute inset-0">
            <img 
              src={heroMovie.thumbnailUrl || heroMovie.videoUrl} 
              alt={heroMovie.title} 
              className="w-full h-full object-cover opacity-60"
            />
            {/* Gradients for smooth fade into background */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-black/60" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-transparent to-transparent w-1/2" />
          </div>

          <div className="absolute bottom-20 left-8 md:left-16 max-w-2xl space-y-4 z-10">
            <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold uppercase rounded tracking-widest">
              Trending AI Release
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight drop-shadow-md">
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
      <div className="px-8 md:px-16 pb-20 -mt-16 relative z-20 space-y-10">
        <div>
          <h2 className="text-xl md:text-2xl font-bold mb-4 tracking-wide text-gray-200">
            {searchQuery ? `Search Results (${filteredMovies.length})` : "Trending on GenFlix"}
          </h2>
          
          {filteredMovies.length === 0 ? (
            <div className="text-gray-500 py-12 text-center bg-zinc-900/40 rounded-xl border border-zinc-800">
              No titles found. Add some movies to your Firebase database!
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredMovies.map((movie) => (
                <div 
                  key={movie.id}
                  onClick={() => setSelectedMovie(movie)}
                  className="group relative bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 cursor-pointer transition transform hover:scale-105 hover:z-30 hover:shadow-2xl aspect-[16/9]"
                >
                  <img 
                    src={movie.thumbnailUrl} 
                    alt={movie.title}
                    className="w-full h-full object-cover"
                    onError={(e: any) => {
                      // Fallback visual if image fails to load
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