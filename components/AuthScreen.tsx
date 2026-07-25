"use client";
import { useState } from "react";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

const PROFILES = [
  { id: "1", name: "Aaron", avatar: "A", bg: "bg-purple-600" },
  { id: "2", name: "Guest", avatar: "G", bg: "bg-blue-600" },
  { id: "3", name: "Kids", avatar: "K", bg: "bg-green-500" }
];

export default function AuthScreen({ user, onSelectProfile }: { user: any, onSelectProfile: (profile: any) => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      setError(err.message || "Failed to authenticate.");
    }
  };

  // 1. If logged in, show the exact Netflix "Who's watching?" UI
  if (user) {
    return (
      <div className="min-h-screen bg-[#141414] text-white flex flex-col items-center justify-center selection:bg-purple-600">
        <h1 className="text-4xl md:text-5xl font-medium text-center mb-10 tracking-wide text-gray-100">
          Who's watching?
        </h1>
        <div className="flex flex-wrap justify-center gap-6 md:gap-10">
          {PROFILES.map((profile) => (
            <div 
              key={profile.id} 
              onClick={() => onSelectProfile(profile)}
              className="group flex flex-col items-center cursor-pointer space-y-4"
            >
              <div className={`w-28 h-28 md:w-36 md:h-36 rounded-md ${profile.bg} flex items-center justify-center text-4xl md:text-6xl font-black text-white border-[3px] border-transparent group-hover:border-white transition-all duration-300 shadow-xl`}>
                {profile.avatar}
              </div>
              <span className="text-gray-400 group-hover:text-white text-lg md:text-xl font-medium transition-colors">
                {profile.name}
              </span>
            </div>
          ))}
        </div>
        <button className="mt-16 border border-gray-500 text-gray-400 px-6 py-2 uppercase tracking-widest font-medium hover:text-white hover:border-white transition-all">
          Manage Profiles
        </button>
      </div>
    );
  }

  // 2. If NOT logged in, show the Netflix-style Auth UI
  return (
    <div className="min-h-screen bg-black flex flex-col relative selection:bg-purple-600 text-white">
      {/* Background Image Setup */}
      <div className="absolute inset-0 z-0 opacity-40">
        <img 
          src="https://assets.nflxext.com/ffe/siteui/vlv3/a73c4363-1dcd-4719-b3b1-3725418fd91d/fe1147dd-78be-44aa-a0e5-2d2994305a13/GB-en-20231016-popsignuptwoweeks-perspective_alpha_website_large.jpg" 
          alt="Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60 bg-gradient-to-t from-black via-black/40 to-black" />
      </div>

      <nav className="relative z-10 px-8 py-6">
        <h1 className="text-purple-600 font-black text-4xl tracking-tighter drop-shadow-lg">GENFLIX</h1>
      </nav>

      <div className="relative z-10 flex-grow flex items-center justify-center p-4">
        <div className="bg-black/80 p-12 md:p-16 rounded-lg w-full max-w-[450px] shadow-2xl">
          <h2 className="text-3xl font-bold mb-8 text-white">{isLogin ? "Sign In" : "Sign Up"}</h2>
          
          {error && <div className="bg-red-500/20 text-red-500 p-3 rounded mb-4 text-sm font-medium">{error}</div>}
          
          <form onSubmit={handleAuth} className="space-y-4">
            <input 
              type="email" 
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#333333] text-white px-4 py-3.5 rounded focus:outline-none focus:ring-2 focus:ring-purple-600 transition"
              required
            />
            <input 
              type="password" 
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#333333] text-white px-4 py-3.5 rounded focus:outline-none focus:ring-2 focus:ring-purple-600 transition"
              required
            />
            <button 
              type="submit" 
              className="w-full bg-purple-600 text-white font-bold py-3.5 rounded mt-4 hover:bg-purple-700 transition"
            >
              {isLogin ? "Sign In" : "Sign Up"}
            </button>
          </form>

          <div className="mt-16 text-gray-400 text-sm">
            {isLogin ? "New to GenFlix? " : "Already have an account? "}
            <button 
              onClick={() => setIsLogin(!isLogin)} 
              className="text-white hover:underline font-medium"
            >
              {isLogin ? "Sign up now." : "Sign in."}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}