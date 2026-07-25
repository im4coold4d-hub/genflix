"use client";
import React from "react";

export default function MovieModal({ movie, onClose, onUpdateProgress }: { movie: any; onClose: () => void; onUpdateProgress: (id: string, time: number) => void }) {
  if (!movie) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#181818] w-full max-w-4xl rounded-2xl overflow-hidden relative max-h-[90vh] overflow-y-auto border border-zinc-800 shadow-2xl">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 z-30 text-white bg-black/70 rounded-full w-10 h-10 flex items-center justify-center font-bold hover:bg-purple-600 transition cursor-pointer shadow-lg"
        >
          ✕
        </button>
        
        {/* Direct HTML5 Video Player */}
        <div className="relative aspect-video w-full bg-black flex items-center justify-center">
          <video 
            src={movie.videoUrl} 
            controls 
            autoPlay 
            className="w-full h-full object-contain"
            onTimeUpdate={(e: any) => {
              if (onUpdateProgress) {
                onUpdateProgress(movie.id, e.target.currentTime);
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
          </div>

          <p className="text-gray-300 text-sm leading-relaxed">{movie.synopsis}</p>
        </div>
      </div>
    </div>
  );
}