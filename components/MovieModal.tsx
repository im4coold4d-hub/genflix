"use client";
import ReactPlayer from "react-player";

export default function MovieModal({ movie, onClose, onUpdateProgress }: { movie: any; onClose: () => void; onUpdateProgress: (id: string, time: number) => void }) {
  const handleProgress = (state: any) => {
    onUpdateProgress(movie.id, state.playedSeconds);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-[#181818] w-full max-w-4xl rounded-xl overflow-hidden relative max-h-[90vh] overflow-y-auto border border-zinc-800 shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 z-20 text-white bg-black/60 rounded-full w-9 h-9 flex items-center justify-center font-bold hover:bg-purple-600 transition cursor-pointer">
          ✕
        </button>
        
        {/* Universal Video Player (Supports MP4 & YouTube) with Progress tracking */}
        <div className="relative aspect-video w-full bg-black">
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
                playerVars: { autoplay: 1 }
              }
            }}
          />
        </div>

        <div className="p-8 space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-bold uppercase px-2.5 py-1 bg-purple-600/20 text-purple-400 border border-purple-500/30 rounded-full">
                {movie.category || "AI Feature"}
              </span>
              <h2 className="text-3xl font-bold mt-2">{movie.title}</h2>
            </div>
            <div className="text-right text-xs text-gray-400">
              <span className="block text-purple-400 font-semibold">Engine</span>
              {movie.aiModel || "Multi-Model Pipeline"}
            </div>
          </div>

          <p className="text-gray-300 text-sm leading-relaxed">{movie.synopsis}</p>

          {/* Multi-Prompt / Production Notes View */}
          <div className="bg-zinc-900 p-5 rounded-lg border border-zinc-800 space-y-3">
            <div className="text-xs text-purple-400 font-bold uppercase tracking-wider flex items-center justify-between">
              <span>AI Production & Scene Prompts</span>
              <span className="text-zinc-500 font-normal">Multi-prompt workflow</span>
            </div>
            <div className="bg-black/40 p-3 rounded font-mono text-xs text-gray-300 whitespace-pre-wrap max-h-40 overflow-y-auto border border-zinc-800">
              {movie.promptNotes || "No specific prompt workflow notes provided for this release."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}