"use client";
import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { ref, get } from "firebase/database";
import AuthScreen from "@/components/AuthScreen";
import MovieModal from "@/components/MovieModal";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [movies, setMovies] = useState<any[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<any>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setProfile(null); // Reset profile on sign out
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Fetch movies from Realtime Database
  useEffect(() => {
    if (!user || !profile) return;
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
  }, [user, profile]);

  if (loading) {
    return <div className="min-h-screen bg-[#141414] flex items-center justify-center text-purple-600 font-bold">Loading GenFlix...</div>;
  }

  // If not logged in, or logged in but haven't chosen a profile yet, show AuthScreen / Profile selector
  if (!user || !profile) {
    return (
      <AuthScreen 
        user={user} 
        onSelectProfile={(selectedProf) => setProfile(selectedProf)} 
      />
    );
  }

  const handleLogout = async () => {
    try {
      setProfile(null);
      await signOut(auth);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const handleSwitchUser = () => {
    setProfile(null); // Clears profile selection to bring back the "Who's watching?" profile picker screen
    setUserMenuOpen(false);
  };

  const heroMovie = movies.length > 0 ? movies[0] : null;
  const filteredMovies = movies.filter(m => m.title?.toLowerCase().includes(searchQuery.toLowerCase()));

  // Prioritize dedicated hero banner field, fallback gracefully
  const heroBannerImg = heroMovie ? (heroMovie.heroBannerUrl || heroMovie.bannerUrl || heroMovie.heroUrl || heroMovie.thumbnailUrl || heroMovie.videoUrl) : "";

  return (
    <div className="min-h-screen bg-[#141414] text-white relative selection:bg-purple-600 selection:text-white pb-24 font-sans">
      
      {/* --- NETFLIX-STYLE NAVIGATION BAR --- */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-4 flex items-center justify-between bg-gradient-to-b from-black via-black/70 to-transparent backdrop-blur-md">
        <div className="flex items-center space-x-10">
          <h1 className="text-purple-600 font-black text-3xl tracking-tighter drop-shadow-lg cursor-pointer">GENFLIX</h1>
          <div className="hidden md:flex space-x-6 text-sm font-medium text-gray-300">
            <span className="text-white font-semibold cursor-pointer hover:text-purple-400 transition">Home</span>
            <span className="cursor-pointer hover:text-purple-400 transition">AI Originals</span>
            <span className="cursor-pointer hover:text-purple-400 transition">My List</span>
          </div>
        </div>

        <div className="flex items-center space-x-5 relative">
          <input 
            type="text" 
            placeholder="Search titles..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-black/60 border border-zinc-700/80 rounded-full px-4 py-1.5 text-sm text-white focus:outline-none focus:border-purple-600 w-48 md:w-64 shadow-inner transition"
          />

          {/* Styled User Dropdown Menu with Switch User & Sign Out */}
          <div className="relative">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setUserMenuOpen(!userMenuOpen);
              }}
              className={`w-10 h-10 rounded-xl ${profile.bg} flex items-center justify-center font-bold text-white shadow-lg transition cursor-pointer border border-purple-400/40 hover:scale-105`}
            >
              <span>{profile.avatar}</span>
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-3 w-56 bg-[#181818]/95 backdrop-blur-xl border border-zinc-700/60 rounded-xl shadow-2xl py-2 z-50 overflow-hidden divide-y divide-zinc-800">
                <div className="px-4 py-3 bg-zinc-900/50 flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-lg ${profile.bg} flex items-center justify-center text-sm`}>
                    {profile.avatar}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs text-gray-400">Watching as</p>
                    <p className="text-sm font-bold text-white truncate">{profile.name}</p>
                  </div>
                </div>
                <div className="py-1">
                  <button 
                    onClick={handleSwitchUser}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-200 hover:bg-zinc-800 transition font-medium cursor-pointer flex items-center space-x-2"
                  >
                    <span>Switch User</span>
                  </button>
                </div>
                <div className="py-1">
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-zinc-800 transition font-medium cursor-pointer flex items-center space-x-2"
                  >
                    <span>Sign Out of GenFlix</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* --- CINEMATIC HERO BANNER --- */}
      {heroMovie && (
        <div className="relative w-full h-[75vh] bg-black flex items-end pt-20">
          <div className="absolute inset-0">
            <img 
              src={heroBannerImg} 
              alt={heroMovie.title} 
              className="w-full h-full object-cover opacity-65"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-black/40 to-black/70" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-transparent to-transparent w-1/2" />
          </div>

          <div className="relative px-8 md:px-16 pb-16 max-w-2xl space-y-4 z-10">
            <span className="px-3 py-1 bg-purple-600/90 text-white text-xs font-bold uppercase rounded-full tracking-wider border border-purple-400/30 shadow-md">
              Trending AI Release
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight drop-shadow-lg text-white">
              {heroMovie.title}
            </h1>
            <p className="text-gray-300 text-sm md:text-base line-clamp-3 leading-relaxed drop-shadow">
              {heroMovie.synopsis}
            </p>
            <div className="flex space-x-4 pt-2">
              <button 
                type="button"
                onClick={() => setSelectedMovie(heroMovie)}
                className="flex items-center space-x-2 bg-white text-black px-8 py-3 rounded-md font-bold text-base hover:bg-gray-200 transition shadow-xl cursor-pointer"
              >
                <span>▶ Play Now</span>
              </button>
              <button 
                type="button"
                onClick={() => setSelectedMovie(heroMovie)}
                className="flex items-center space-x-2 bg-zinc-600/80 backdrop-blur text-white px-6 py-3 rounded-md font-bold text-base hover:bg-zinc-600 transition shadow-xl cursor-pointer"
              >
                <span>ℹ More Info</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MOVIE ROWS --- */}
      <div className="px-8 md:px-16 mt-8 space-y-6">
        <h2 className="text-xl md:text-2xl font-bold tracking-wide text-gray-200">
          {searchQuery ? `Search Results (${filteredMovies.length})` : "Trending on GenFlix"}
        </h2>
        
        {filteredMovies.length === 0 ? (
          <div className="text-gray-500 py-16 text-center bg-zinc-900/40 rounded-xl border border-zinc-800">
            No titles found.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {filteredMovies.map((movie) => (
              <div 
                key={movie.id}
                onClick={() => setSelectedMovie(movie)}
                className="group relative bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-purple-500/50 aspect-[16/9]"
              >
                <img 
                  src={movie.thumbnailUrl} 
                  alt={movie.title}
                  className="w-full h-full object-cover"
                  onError={(e: any) => {
                    e.target.src = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                  <p className="font-bold text-sm text-white truncate">{movie.title}</p>
                  <span className="text-[10px] text-purple-400 font-medium uppercase tracking-wider">{movie.category || "AI Feature"}</span>
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