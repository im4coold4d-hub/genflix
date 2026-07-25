"use client";

import { useState } from "react";
import { ref, push } from "firebase/database";
import { db } from "@/lib/firebase";

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");

  const [title, setTitle] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [category, setCategory] = useState("Movies"); // Movies, Series, Shorts
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [heroBannerUrl, setHeroBannerUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [aiModel, setAiModel] = useState("");
  const [promptNotes, setPromptNotes] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const ADMIN_PASSWORD = "genflix_admin_secure";

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert("Incorrect Password!");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const moviesRef = ref(db, "movies");
      await push(moviesRef, {
        title,
        synopsis,
        category,
        thumbnailUrl,
        heroBannerUrl,
        videoUrl,
        aiModel,
        promptNotes,
      });
      setSuccessMessage("Successfully published to GenFlix!");
      setTitle("");
      setSynopsis("");
      setThumbnailUrl("");
      setHeroBannerUrl("");
      setVideoUrl("");
      setAiModel("");
      setPromptNotes("");
    } catch (error) {
      console.error("Error adding content: ", error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#141414] text-white flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-zinc-900 p-8 rounded-xl border border-zinc-800 max-w-md w-full space-y-4 shadow-2xl">
          <h1 className="text-2xl font-extrabold text-purple-500">Creator Portal</h1>
          <p className="text-sm text-gray-400">Enter your secure password to access the upload dashboard.</p>
          <input
            type="password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            placeholder="Password..."
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500 transition"
            required
          />
          <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition shadow-[0_0_15px_rgba(139,92,246,0.4)]">
            Unlock Portal
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#141414] text-white p-6 md:p-16">
      <div className="max-w-3xl mx-auto bg-zinc-900 p-8 md:p-10 rounded-2xl border border-zinc-800 shadow-2xl space-y-6">
        <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
          <div>
            <h1 className="text-3xl font-extrabold text-purple-500">GenFlix Creator Studio</h1>
            <p className="text-sm text-gray-400">Upload and publish multi-prompt AI films, series, or shorts.</p>
          </div>
          <a href="/" className="text-xs text-gray-400 hover:text-white underline">Back to GenFlix</a>
        </div>

        {successMessage && (
          <div className="bg-purple-600/20 border border-purple-500/50 text-purple-300 p-4 rounded-xl text-sm font-medium">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Title</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500" placeholder="e.g. Neon Chronicles" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Format / Section</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500">
                <option value="Movies">Movies</option>
                <option value="Series">Series</option>
                <option value="Shorts">Shorts</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Synopsis</label>
            <textarea value={synopsis} onChange={(e) => setSynopsis(e.target.value)} required rows={3} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500" placeholder="Plot description..." />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">AI Engines / Models Used</label>
              <input type="text" value={aiModel} onChange={(e) => setAiModel(e.target.value)} required className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500" placeholder="e.g. Sora, Runway Gen-3, ElevenLabs" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Video Stream URL (.mp4)</label>
              <input type="url" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} required className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500" placeholder="https://..." />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Thumbnail Image URL (16:9)</label>
              <input type="url" value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)} required className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500" placeholder="https://..." />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Hero Banner Image URL</label>
              <input type="url" value={heroBannerUrl} onChange={(e) => setHeroBannerUrl(e.target.value)} required className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500" placeholder="https://..." />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Multi-Prompt / Scene Breakdown Notes</label>
            <textarea value={promptNotes} onChange={(e) => setPromptNotes(e.target.value)} required rows={4} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white font-mono text-xs focus:outline-none focus:border-purple-500" placeholder="Scene 1 Prompt: ...&#10;Scene 2 Prompt: ...&#10;Character LoRA settings: ..." />
          </div>

          <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 rounded-lg transition shadow-[0_0_20px_rgba(139,92,246,0.4)]">
            Publish Release
          </button>
        </form>
      </div>
    </div>
  );
}