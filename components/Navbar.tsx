"use client";
import { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function Navbar({ activeTab, setActiveTab, activeProfile, onSwitchProfile }: { activeTab: string; setActiveTab: (tab: string) => void; activeProfile: { name: string; avatar: string; bg?: string } | null; onSwitchProfile: () => void }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 z-50 w-full px-6 md:px-12 py-4 transition-all duration-300 flex items-center justify-between select-none ${isScrolled ? "bg-[#141414]/95 backdrop-blur-md shadow-2xl border-b border-zinc-800/60" : "bg-gradient-to-b from-black/90 via-black/50 to-transparent"}`}>
      <div className="flex items-center space-x-10">
        <h1 
          onClick={() => setActiveTab("Home")} 
          className="text-3xl font-black tracking-wider text-purple-500 cursor-pointer drop-shadow-[0_0_15px_rgba(139,92,246,0.5)] transform hover:scale-105 transition-transform"
        >
          GENFLIX
        </h1>
        <ul className="hidden md:flex space-x-6 text-sm font-medium text-gray-300">
          {["Home", "Movies", "Series", "Shorts"].map((tab) => (
            <li
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`cursor-pointer transition-all hover:text-white ${activeTab === tab ? "font-bold text-white border-b-2 border-purple-500 pb-1" : ""}`}
            >
              {tab}
            </li>
          ))}
        </ul>
      </div>

      {/* Right side profile menu - safely padded from screen edge */}
      <div className="relative">
        <button 
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center space-x-3 cursor-pointer group bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 px-3.5 py-2 rounded-xl transition-all shadow-md"
          style={{ WebkitTapHighlightColor: "transparent" }}
        >
          <div className={`w-8 h-8 rounded-lg ${activeProfile?.bg || "bg-gradient-to-br from-purple-600 to-indigo-800"} flex items-center justify-center text-base shadow-inner`}>
            {activeProfile?.avatar || "🎬"}
          </div>
          <span className="hidden md:block text-sm text-gray-200 group-hover:text-white transition font-medium">{activeProfile?.name || "Creator"}</span>
          <span className={`text-xs text-gray-400 transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""}`}>▼</span>
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 top-full mt-2 w-56 bg-zinc-950 border border-zinc-800/90 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.95)] py-2 backdrop-blur-2xl z-50 animate-fade-in">
            <div className="px-4 py-3 border-b border-zinc-900 text-xs text-zinc-400">
              Signed in as <span className="font-bold text-white block truncate mt-0.5">{auth.currentUser?.email}</span>
            </div>
            <button 
              onClick={() => { setDropdownOpen(false); onSwitchProfile(); }}
              className="w-full text-left px-4 py-3 text-sm text-gray-200 hover:bg-purple-600/20 hover:text-white transition font-medium flex items-center justify-between"
            >
              <span>Switch Profile</span>
              <span className="text-xs text-purple-400">●</span>
            </button>
            <button 
              onClick={() => { setDropdownOpen(false); signOut(auth); }}
              className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition font-medium border-t border-zinc-900"
            >
              Sign Out of GenFlix
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}