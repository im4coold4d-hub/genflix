"use client";
import { useState, useEffect, useRef } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { ref, get } from "firebase/database";
import AuthScreen from "@/components/AuthScreen";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [movies, setMovies] = useState<any[]>([]);
  const [activePlayerMovie, setActivePlayerMovie] = useState<any>(null);
  const [infoMovie, setInfoMovie] = useState<any>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Continue Watching State
  const [watchProgress, setWatchProgress] = useState<Record<string, number>>({});

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) setProfile(null);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

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
    
    // Load local progress
    const savedProgress = localStorage.getItem("genflix_progress");
    if (savedProgress) {
      setWatchProgress(JSON.parse(savedProgress));
    }
  }, [user, profile]);

  if (loading) {
    return <div className="min-h-screen bg-[#141414] flex items-center justify-center text-purple-600 font-bold">Loading GenFlix...</div>;
  }

  if (!user || !profile) {
    return <AuthScreen user={user} onSelectProfile={(selectedProf) => setProfile(selectedProf)} />;
  }

  const handleLogout = async () => {
    try {
      setProfile(null);
      await signOut(auth);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const handleTimeUpdate = (movieId: string, time: number) => {
    if (time < 2) return; // Ignore accidental clicks under 2 seconds
    setWatchProgress(prev => {
      const newProgress = { ...prev, [movieId]: time };
      localStorage.setItem("genflix_progress", JSON.stringify(newProgress));
      return newProgress;
    });
  };

  const heroMovie = movies.length > 0 ? movies[0] : null;
  const filteredMovies = movies.filter(m => m.title?.toLowerCase().includes(searchQuery.toLowerCase().trim()));
  const continueWatchingMovies = movies.filter(m => watchProgress[m.id] && watchProgress[m.id] > 2);
  const heroBannerImg = heroMovie ? (heroMovie.heroBannerUrl || heroMovie.bannerUrl || heroMovie.heroUrl || heroMovie.thumbnailUrl || heroMovie.videoUrl) : "";

  // ==========================================
  // IMMERSIVE FULL-SCREEN PLAYER
  // ==========================================
  if (activePlayerMovie) {
    return (
      <div className="fixed inset-0 z-[9999] bg-black w-screen h-screen overflow-hidden flex items-center justify-center">
        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center bg-gradient-to-b from-black/90 to-transparent z-50">
          <button 
            onClick={() => setActivePlayerMovie(null)}
            className="flex items-center space-x-2 text-white bg-zinc-800/80 hover:bg-zinc-700 px-5 py-2.5 rounded-full font-bold transition cursor-pointer backdrop-blur"
          >
            <span>← Back to Browse</span>
          </button>
          <h2 className="text-white font-bold text-lg tracking-wide hidden md:block drop-shadow-md">
            {activePlayerMovie.title}
          </h2>
          <div className="w-24" /> {/* Spacer */}
        </div>

        <video 
          src={activePlayerMovie.videoUrl} 
          controls 
          autoPlay 
          playsInline
          className="absolute inset-0 w-full h-full object-contain bg-black"
          onTimeUpdate={(e) => handleTimeUpdate(activePlayerMovie.id, e.currentTarget.currentTime)}
          onLoadedMetadata={(e) => {
            // Resume playback if progress exists
            if (watchProgress[activePlayerMovie.id]) {
              e.currentTarget.currentTime = watchProgress[activePlayerMovie.id];
            }
          }}
          onError={(e) => console.error("Video playback failed:", e)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#141414] text-white relative selection:bg-purple-600 selection:text-white pb-24 font-sans">
      
      {/* --- NETFLIX NAVIGATION BAR --- */}
      <nav className="fixed top-0 left-0 right-0 z-40 px-8 py-4 flex items-center justify-between bg-gradient-to-b from-black via-black/80 to-transparent backdrop-blur-md">
        <div className="flex items-center space-x-10">
          <h1 className="text-purple-600 font-black text-3xl tracking-tighter drop-shadow-lg cursor-pointer">GENFLIX</h1>
          <div className="hidden md:flex space-x-6 text-sm font-medium text-gray-300">
            <span className="text-white font-semibold cursor-pointer">Home</span>
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
            className="bg-black/70 border border-zinc-700/80 rounded-full px-4 py-1.5 text-sm text-white focus:outline-none focus:border-purple-600 w-48 md:w-64 shadow-inner transition"
          />

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
                    onClick={() => { setProfile(null); setUserMenuOpen(false); }}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-200 hover:bg-zinc-800 transition font-medium cursor-pointer"
                  >
                    Switch User
                  </button>
                </div>
                <div className="py-1">
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-zinc-800 transition font-medium cursor-pointer"
                  >
                    Sign Out of GenFlix
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* --- CINEMATIC FULL HERO BANNER --- */}
      {heroMovie && !searchQuery && (
        <div className="relative w-full h-[85vh] bg-black flex items-end">
          <div className="absolute inset-0">
            <img 
              src={heroBannerImg} 
              alt={heroMovie.title} 
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-black/40 to-black/60" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-transparent to-transparent w-2/3" />
          </div>

          <div className="relative px-8 md:px-16 pb-20 max-w-2xl space-y-4 z-10">
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
                onClick={() => setActivePlayerMovie(heroMovie)}
                className="flex items-center space-x-2 bg-white text-black px-8 py-3.5 rounded-md font-bold text-base hover:bg-gray-200 transition shadow-xl cursor-pointer"
              >
                <span>▶ Play Now</span>
              </button>
              <button 
                type="button"
                onClick={() => setInfoMovie(heroMovie)}
                className="flex items-center space-x-2 bg-zinc-600/80 backdrop-blur text-white px-6 py-3.5 rounded-md font-bold text-base hover:bg-zinc-600 transition shadow-xl cursor-pointer"
              >
                <span>ℹ More Info</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- CONTINUE WATCHING ROW --- */}
      {!searchQuery && continueWatchingMovies.length > 0 && (
        <div className="px-8 md:px-16 mt-8 space-y-4">
          <h2 className="text-xl md:text-2xl font-bold tracking-wide text-gray-200">
            Continue Watching for {profile.name}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {continueWatchingMovies.map((movie) => (
              <div 
                key={`cw-${movie.id}`}
                onClick={() => setActivePlayerMovie(movie)}
                className="group relative bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-purple-500/50 aspect-[16/9]"
              >
                <img 
                  src={movie.thumbnailUrl} 
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Progress Bar UI */}
                <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-zinc-700/80">
                  <div className="h-full bg-purple-600" style={{ width: "50%" }} /> {/* Placeholder visual for now */}
                </div>

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white font-bold border border-white/40">
                    ▶
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- MOVIE ROWS / SEARCH RESULTS --- */}
      <div className={`px-8 md:px-16 ${heroMovie && !searchQuery ? "mt-12" : "mt-32"} space-y-6`}>
        <h2 className="text-xl md:text-2xl font-bold tracking-wide text-gray-200">
          {searchQuery ? `Search Results (${filteredMovies.length})` : "Trending on GenFlix"}
        </h2>
        
        {filteredMovies.length === 0 ? (
          <div className="text-gray-500 py-16 text-center bg-zinc-900/40 rounded-xl border border-zinc-800">
            No titles found matching &quot;{searchQuery}&quot;.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {filteredMovies.map((movie) => (
              <div 
                key={movie.id}
                onClick={() => setInfoMovie(movie)}
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

      {/* --- MORE INFO MODAL (FIXED) --- */}
      {infoMovie && (
        <div className="fixed inset-0 z-[9999] bg-black/85 flex items-center justify-center p-4 backdrop-blur-md">
          <div className="bg-[#181818] w-full max-w-2xl rounded-2xl overflow-hidden relative border border-zinc-800 shadow-2xl p-8 space-y-6 animate-fade-in">
            <button 
              onClick={() => setInfoMovie(null)} 
              className="absolute top-4 right-4 text-white bg-black/70 rounded-full w-10 h-10 flex items-center justify-center font-bold hover:bg-purple-600 transition cursor-pointer"
            >
              ✕
            </button>
            <div>
              <span className="text-xs font-bold uppercase px-3 py-1 bg-purple-600/20 text-purple-400 border border-purple-500/30 rounded-full">
                {infoMovie.category || "AI Feature"}
              </span>
              <h2 className="text-3xl font-extrabold mt-3 text-white">{infoMovie.title}</h2>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">{infoMovie.synopsis}</p>
            <button 
              onClick={() => {
                const mov = infoMovie;
                setInfoMovie(null);
                setActivePlayerMovie(mov);
              }}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 rounded-xl transition cursor-pointer flex justify-center items-center space-x-2"
            >
              <span>▶</span>
              <span>Play Now</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}