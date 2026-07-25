"use client";
import React, { useState, useRef, useEffect } from "react";

export default function MovieModal({ movie, onClose, onUpdateProgress }: { movie: any; onClose: () => void; onUpdateProgress: (id: string, time: number) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (videoRef.current && movie?.videoUrl) {
      videoRef.current.load();
      videoRef.current.play().catch((err) => {
        console.warn("Autoplay blocked or failed:", err);
      });
    }
  }, [movie]);

  if (!movie) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-md">
      <div className="bg-[#181818] w-full max-w-4xl rounded-2xl overflow-hidden relative max-h-[90vh] overflow-y-auto border border-zinc-800 shadow-2xl">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 z-30 text-white bg-black/70 rounded-full w-10 h-10 flex items-center justify-center font-bold hover:bg-purple-600 transition cursor-pointer shadow-lg"
        >
          ✕
        </button>
        
        {/* Forced HTML5 Video Element with Direct Ref Control */}
        <div className="relative aspect-video w-full bg-black flex items-center justify-center">
          {isLoading && !videoError && (
            <div className="absolute inset-0 flex items-center justify-center text-purple-400 text-sm font-semibold animate-pulse">
              Loading video stream...
            </div>
          )}

          {videoError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-zinc-900 text-red-400 space-y-2">
              <p className="font-bold">Video playback error</p>
              <p className="text-xs text-gray-400 max-w-md font-mono">{videoError}</p>
              <p className="text-xs text-gray-500 mt-2">URL provided: {movie.videoUrl}</p>
            </div>
          ) : (
            <video 
              ref={videoRef}
              src={movie.videoUrl} 
              controls 
              autoPlay 
              playsInline
              className="w-full h-full object-contain"
              onLoadedData={() => setIsLoading(false)}
              onError={(e: any) => {
                setIsLoading(false);
                const errCode = e.target?.error?.code;
                const errMsg = e.target?.error?.message || "Unknown browser decoding error";
                setVideoError(`Error code ${errCode}: ${errMsg}`);
              }}
              onTimeUpdate={(e: any) => {
                if (onUpdateProgress) {
                  onUpdateProgress(movie.id, e.target.currentTime);
                }
              }}
            />
          )}
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