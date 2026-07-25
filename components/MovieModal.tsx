"use client";
import React from "react";
import ReactPlayerBase from "react-player";

const ReactPlayer = ReactPlayerBase as any;

export default function MovieModal({ movie, onClose, onUpdateProgress }: { movie: any; onClose: () => void; onUpdateProgress: (id: string, time: number) => void }) {
  const handleProgress = (state: any) => {
    if (onUpdateProgress) {
      onUpdateProgress(movie.id, state.playedSeconds);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 backdrop-blur-md">
      <div className="bg-[#181818] w-full max-w-4xl rounded-2xl overflow-hidden relative max-h-[90vh] overflow-y-auto border border-zinc-800 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 z-30 text-white bg-black/70 rounded-full w-10 h-10 flex items-center justify-center font-bold hover:bg-purple-600 transition cursor-pointer shadow-lg"
        >
          ✕
        </button>
        
        {/* Universal Video Player (Handles YouTube & MP4) */}
        <div className="relative aspect-video w-full bg-black flex items-center justify-center">
          <ReactPlayer
            url={movie.videoUrl}
            width="100%"
            height="100%"
            controls={true}
            playing={true}
            onProgress={handleProgress}
            progressInterval={1000}
            config={{
              youtube: {
                playerVars: { autoplay: 1, modestbranding: 1 }
              }
            }}
          />
        </div>

        <div className="p-8 space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-bold uppercase px-3 py-1 bg-purple-600/20 text-purple-400 border border-purple-500/30 rounded-full">
                {movie.category || "AI Feature"}
              </span>
              <h2 className="text-3xl font-extrabold mt-3 text-white tracking-tight">{movie.title}</h2>
            </div>
            <div className="text-right text-xs text-gray-400">
              <span className="block text-purple-400 font-semibold uppercase tracking-wider">Engine</span>
              {movie.aiModel || "Multi-Model Pipeline"}
            </div>
          </div>

          <p className="text-gray-300 text-sm leading-relaxed">{movie.synopsis}</p>

          <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800 space-y-3">
            <div className="text-xs text-purple-400 font-bold uppercase tracking-wider flex items-center justify-between">
              <span>AI Production & Scene Prompts</span>
              <span className="text-zinc-500 font-normal">Multi-prompt workflow</span>
            </div>
            <div className="bg-black/50 p-3.5 rounded-lg font-mono text-xs text-gray-300 whitespace-pre-wrap max-h-40 overflow-y-auto border border-zinc-800/80">
              {movie.promptNotes || "No specific prompt workflow notes provided for this release."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}