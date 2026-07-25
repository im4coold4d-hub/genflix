"use client";

import { useEffect, useState } from "react";
import { ref, get } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "@/lib/firebase";
import AuthScreen from "@/components/AuthScreen";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import MovieRow from "@/components/MovieRow";
import MovieModal from "@/components/MovieModal";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [activeProfile, setActiveProfile] = useState<{ name: string; avatar: string } | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [movies, setMovies] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("Home");
  const [selectedMovie, setSelectedMovie] = useState<any>(null);
  const [progressMap, setProgressMap] = useState<{ [id: string]: number }>({});

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
      if (!currentUser) setActiveProfile(null);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    const savedProgress = localStorage.getItem(`genflix_progress_${user.uid}`);
    if (savedProgress) {
      try { setProgressMap(JSON.parse(savedProgress)); } catch (e) { console.error(e); }
    }

    const fetchMovies = async () => {
      const dbRef = ref(db, "movies");
      const snapshot = await get(dbRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        const movieList = Object.keys(data.movies || data).map((key) => ({
          id: key,
          ...(data.movies ? data.movies[key] : data[key]),
        }));
        setMovies(movieList);
      }
    };
    fetchMovies();
  }, [user]);

  const handleUpdateProgress = (id: string, time: number) => {
    if (!user) return;
    const updated = { ...progressMap, [id]: time };
    setProgressMap(updated);
    localStorage.setItem(`genflix_progress_${user.uid}`, JSON.stringify(updated));
  };

  if (authLoading) {
    return <div className="min-h-screen bg-[#141414] text-white flex items-center justify-center">Loading GenFlix...</div>;
  }

  if (!user || !activeProfile) {
    return <AuthScreen user={user} onSelectProfile={(profile) => setActiveProfile(profile)} />;
  }

  const filteredMovies = movies.filter((m) => {
    if (activeTab === "Home") return true;
    return m.category?.toLowerCase() === activeTab.toLowerCase();
  });

  const featuredMovie = filteredMovies[0] || movies[0] || {
    title: "GenFlix Original",
    synopsis: "Explore next-generation AI cinema workflows.",
    heroBannerUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000&auto=format&fit=crop",
  };

  const continueWatchingList = movies.filter((m) => progressMap[m.id] && progressMap[m.id] > 5);

  return (
    <main className="relative min-h-screen bg-[#141414] text-white overflow-x-hidden">
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        activeProfile={activeProfile} 
        onSwitchProfile={() => setActiveProfile(null)} 
      />
      
      <Hero movie={featuredMovie} onSelectMovie={(movie) => setSelectedMovie(movie)} />

      <div className="relative z-20 pb-32 -mt-32 md:-mt-44 space-y-8">
        {activeTab === "Home" && continueWatchingList.length > 0 && (
          <MovieRow title="Continue Watching" movies={continueWatchingList} onSelectMovie={(movie) => setSelectedMovie(movie)} />
        )}

        <MovieRow title={activeTab === "Home" ? "Trending AI Releases" : `${activeTab} Library`} movies={filteredMovies} onSelectMovie={(movie) => setSelectedMovie(movie)} />

        {activeTab === "Home" && (
          <>
            <MovieRow title="Top AI Series & Epics" movies={movies.filter(m => m.category === "Series")} onSelectMovie={(movie) => setSelectedMovie(movie)} />
            <MovieRow title="Cinematic AI Shorts" movies={movies.filter(m => m.category === "Shorts")} onSelectMovie={(movie) => setSelectedMovie(movie)} />
          </>
        )}
      </div>

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} onUpdateProgress={handleUpdateProgress} />
      )}
    </main>
  );
}