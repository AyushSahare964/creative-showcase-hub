import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play } from "lucide-react";
import { Video } from "@/types";

interface VideoPlayerModalProps {
  video: Video | null;
  isOpen: boolean;
  onClose: () => void;
}

export const VideoPlayerModal = ({ video, isOpen, onClose }: VideoPlayerModalProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  if (!video) return null;

  const isYouTube = video.videoUrl.includes("youtube.com") || video.videoUrl.includes("youtu.be");
  const isVimeo = video.videoUrl.includes("vimeo.com");
  const isDirectVideo = video.videoUrl.endsWith(".mp4") || video.videoUrl.endsWith(".webm") || video.videoUrl.endsWith(".mov") || video.videoUrl.includes("supabase");

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : url;
  };

  const getVimeoEmbedUrl = (url: string) => {
    const videoId = url.match(/vimeo\.com\/(\d+)/)?.[1];
    return videoId ? `https://player.vimeo.com/video/${videoId}?autoplay=1` : url;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
          onClick={onClose}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Video Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            className="relative w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Video Title */}
            <div className="mb-4">
              <span className="text-primary text-sm uppercase tracking-wider">{video.category}</span>
              <h2 className="font-display text-2xl md:text-3xl text-white mt-1">{video.title}</h2>
            </div>

            {/* Video Player */}
            <div className="relative aspect-video rounded-xl overflow-hidden bg-black shadow-2xl">
              {isDirectVideo ? (
                <video
                  ref={videoRef}
                  src={video.videoUrl}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                  poster={video.thumbnail}
                >
                  Your browser does not support the video tag.
                </video>
              ) : isYouTube ? (
                <iframe
                  src={getYouTubeEmbedUrl(video.videoUrl)}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : isVimeo ? (
                <iframe
                  src={getVimeoEmbedUrl(video.videoUrl)}
                  className="w-full h-full"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <iframe
                  src={video.videoUrl}
                  className="w-full h-full"
                  allowFullScreen
                />
              )}
            </div>

            {/* Video Description */}
            {video.description && (
              <p className="mt-4 text-muted-foreground text-sm md:text-base">
                {video.description}
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
