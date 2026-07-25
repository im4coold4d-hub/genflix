"use client";
import { useState } from "react";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";

const PRESET_AVATARS = [
  { label: "Creator", bg: "bg-gradient-to-br from-purple-600 via-indigo-700 to-purple-900", icon: "🎬" },
  { label: "Cinematic", bg: "bg-gradient-to-br from-blue-600 via-cyan-600 to-blue-900", icon: "🚀" },
  { label: "Director", bg: "bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-900", icon: "🎥" },
  { label: "VFX Artist", bg: "bg-gradient-to-br from-rose-600 via-pink-600 to-rose-900", icon: "✨" },
  { label: "Guest", bg: "bg-gradient-to-br from-amber-600 via-orange-600 to-amber-900", icon: "🍿" },
];

const ICON_OPTIONS = ["🎬", "🚀", "🎥", "✨", "🍿", "🔥", "👑", "💻", "🎨", "⚡", "🔮", "👾"];
const COLOR_OPTIONS = [
  "bg-gradient-to-br from-purple-600 via-indigo-700 to-purple-900",
  "bg-gradient-to-br from-blue-600 via-cyan-600 to-blue-900",
  "bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-900",
  "bg-gradient-to-br from-rose-600 via-pink-600 to-rose-900",
  "bg-gradient-to-br from-amber-600 via-orange-600 to-amber-900",
  "bg-gradient-to-br from-zinc-700 via-zinc-800 to-black",
];

export default function AuthScreen({ user, onSelectProfile }: { user: any; onSelectProfile: (profile: { name: string; avatar: string; bg: string }) => void }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Customizer state
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [customName, setCustomName] = useState("My Profile");
  const [customIcon, setCustomIcon] = useState("🎬");
  const [customBg, setCustomBg] = useState(COLOR_OPTIONS[0]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (user) {
    if (isCustomizing) {
      return (
        <div className="relative min-h-screen bg-[#141414] flex flex-col items-center justify-center p-6 text-white select-none">
          <div className="absolute w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="relative z-10 max-w-lg w-full bg-black/90 border border-zinc-800 p-8 rounded-2xl shadow-2xl backdrop-blur-xl space-y-6 animate-fade-in">
            <div className="text-center">
              <h2 className="text-2xl font-black text-purple-500 tracking-wider">Customize Avatar</h2>
              <p className="text-xs text-zinc-400 mt-1">Design your unique streaming profile card</p>
            </div>

            {/* Live Preview */}
            <div className="flex flex-col items-center justify-center py-4">
              <div className={`w-36 h-36 rounded-2xl ${customBg} flex flex-col items-center justify-center text-5xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] border-2 border-purple-400 ring-4 ring-purple-500/30`}>
                <span>{customIcon}</span>
              </div>
              <input 
                type="text" 
                value={customName} 
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="Profile Name"
                className="mt-4 bg-zinc-900 border border-zinc-700 text-center text-white font-bold text-lg py-2 px-4 rounded-xl w-full focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Icon Picker */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Choose Icon</label>
              <div className="grid grid-cols-6 gap-2">
                {ICON_OPTIONS.map((ic) => (
                  <button
                    key={ic}
                    onClick={() => setCustomIcon(ic)}
                    className={`h-12 rounded-xl text-2xl flex items-center justify-center border transition-all ${customIcon === ic ? "bg-purple-600/30 border-purple-500 scale-105" : "bg-zinc-900 border-zinc-800 hover:border-zinc-600"}`}
                  >
                    {ic}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Theme Picker */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Choose Gradient Theme</label>
              <div className="flex gap-3 justify-center">
                {COLOR_OPTIONS.map((col, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCustomBg(col)}
                    className={`w-10 h-10 rounded-xl ${col} border-2 transition-all ${customBg === col ? "border-white scale-110 shadow-lg" : "border-transparent opacity-70 hover:opacity-100"}`}
                  />
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-4 pt-4">
              <button 
                onClick={() => setIsCustomizing(false)}
                className="w-1/2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold py-3 rounded-xl transition text-sm outline-none"
              >
                Cancel
              </button>
              <button 
                onClick={() => onSelectProfile({ name: customName || "Profile", avatar: customIcon, bg: customBg })}
                className="w-1/2 bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-xl transition text-sm shadow-[0_0_20px_rgba(139,92,246,0.4)] outline-none"
              >
                Save & Watch
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="relative min-h-screen bg-[#141414] flex flex-col items-center justify-center p-6 text-white select-none">
        <div className="absolute w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl w-full mx-auto text-center space-y-10 animate-fade-in">
          <div>
            <h1 className="text-4xl md:text-6xl font-black text-purple-500 tracking-wider drop-shadow-[0_0_25px_rgba(139,92,246,0.4)] mb-3">GENFLIX</h1>
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-200">Who&apos;s watching?</h2>
            <p className="text-sm text-zinc-400 mt-2">Select a profile or create your own custom avatar</p>
          </div>
          
          {/* Preset Profiles + Customizer Button */}
          <div className="flex justify-center items-center gap-6 py-4 flex-wrap">
            {PRESET_AVATARS.map((avatar) => (
              <div 
                key={avatar.label}
                onClick={() => onSelectProfile({ name: avatar.label, avatar: avatar.icon, bg: avatar.bg })}
                className="flex flex-col items-center cursor-pointer group outline-none transition-all duration-300 transform hover:scale-105"
              >
                <div className={`w-32 h-32 md:w-40 md:h-40 rounded-2xl ${avatar.bg} flex flex-col items-center justify-center text-4xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] border-2 border-zinc-800 group-hover:border-purple-400 transition-all duration-300`}>
                  <span className="mb-1">{avatar.icon}</span>
                  <span className="text-xs font-bold uppercase tracking-wider text-white/90">{avatar.label}</span>
                </div>
                <span className="mt-4 text-zinc-400 group-hover:text-white font-semibold transition text-base">Watch as {avatar.label}</span>
              </div>
            ))}

            {/* Custom Avatar Creator Button */}
            <div 
              onClick={() => setIsCustomizing(true)}
              className="flex flex-col items-center cursor-pointer group outline-none transition-all duration-300 transform hover:scale-105"
            >
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-zinc-900 border-2 border-dashed border-zinc-700 group-hover:border-purple-500 flex flex-col items-center justify-center text-3xl shadow-xl transition-all">
                <span className="text-purple-400 text-4xl mb-1">+</span>
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">Custom</span>
              </div>
              <span className="mt-4 text-purple-400 group-hover:text-purple-300 font-semibold transition text-base">Create Custom</span>
            </div>
          </div>

          <div className="pt-8">
            <button 
              onClick={() => signOut(auth)} 
              className="text-sm font-medium text-gray-400 hover:text-white border border-zinc-700 hover:border-purple-500 px-8 py-3.5 rounded-xl transition-all bg-black/50 hover:bg-zinc-900 outline-none"
            >
              Sign Out of Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#141414] flex items-center justify-center p-4 select-none">
      <div className="absolute w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 bg-black/85 p-10 md:p-14 rounded-2xl border border-zinc-800/80 w-full max-w-[460px] shadow-[0_25px_60px_rgba(0,0,0,0.9)] backdrop-blur-2xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-black text-purple-500 tracking-wider mb-2 drop-shadow-[0_0_15px_rgba(139,92,246,0.3)]">GENFLIX</h1>
          <h2 className="text-xl font-bold text-gray-200">{isSignUp ? "Create your account" : "Welcome back"}</h2>
        </div>

        {error && <div className="bg-red-500/20 border border-red-500/50 text-red-300 p-4 rounded-xl text-xs mb-6 font-medium">{error}</div>}

        <form onSubmit={handleAuth} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
              className="w-full bg-zinc-900/90 border border-zinc-700 rounded-xl p-4 text-white placeholder-zinc-600 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition text-sm font-medium"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full bg-zinc-900/90 border border-zinc-700 rounded-xl p-4 text-white placeholder-zinc-600 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition text-sm font-medium"
            />
          </div>
          <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl transition-all shadow-[0_0_25px_rgba(139,92,246,0.4)] text-sm tracking-wide transform active:scale-[0.98] outline-none cursor-pointer">
            {isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </form>

        <div className="text-sm text-gray-400 text-center pt-6">
          {isSignUp ? "Already have an account?" : "New to GenFlix?"}{" "}
          <button onClick={() => setIsSignUp(!isSignUp)} className="text-white hover:text-purple-400 transition font-bold ml-1 outline-none">
            {isSignUp ? "Sign in now." : "Sign up now."}
          </button>
        </div>
      </div>
    </div>
  );
}