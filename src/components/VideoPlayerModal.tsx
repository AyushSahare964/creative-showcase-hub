import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Video } from "@/types";
import { useIsMobile } from "@/hooks/use-mobile";

interface VideoPlayerModalProps {
  video: Video | null;
  isOpen: boolean;
  onClose: () => void;
}

export const VideoPlayerModal = ({ video, isOpen, onClose }: VideoPlayerModalProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isMobile = useIsMobile();
  const [isVertical, setIsVertical] = useState(false);

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

  // Detect video orientation when metadata loads
  const handleVideoMetadata = () => {
    if (videoRef.current) {
      const { videoWidth, videoHeight } = videoRef.current;
      setIsVertical(videoHeight > videoWidth);
    }
  };

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

  // Dynamic container classes based on video orientation and device
  const getVideoContainerClasses = () => {
    if (isVertical || isMobile) {
      // For vertical videos or mobile: use a taller aspect ratio
      return "relative w-full max-h-[80vh] rounded-xl overflow-hidden bg-black shadow-2xl flex items-center justify-center";
    }
    // For horizontal videos on desktop: standard 16:9
    return "relative aspect-video rounded-xl overflow-hidden bg-black shadow-2xl";
  };

  const getVideoElementClasses = () => {
    if (isVertical) {
      // Vertical video: contain within container, don't crop
      return "max-w-full max-h-[80vh] object-contain";
    }
    // Horizontal video: fill container
    return "w-full h-full object-contain";
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/95 backdrop-blur-sm"
          onClick={onClose}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 sm:top-4 sm:right-4 p-2 sm:p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </button>

          {/* Video Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            className={`relative w-full ${isMobile ? 'max-w-full' : 'max-w-5xl'} flex flex-col`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Video Title - Hidden on very small screens during playback */}
            <div className="mb-2 sm:mb-4 px-2">
              <span className="text-primary text-xs sm:text-sm uppercase tracking-wider">{video.category}</span>
              <h2 className="font-display text-lg sm:text-2xl md:text-3xl text-white mt-1 line-clamp-2">{video.title}</h2>
            </div>

            {/* Video Player */}
            <div className={getVideoContainerClasses()}>
              {isDirectVideo ? (
                <video
                  ref={videoRef}
                  src={video.videoUrl}
                  controls
                  autoPlay
                  playsInline
                  className={getVideoElementClasses()}
                  poster={video.thumbnail}
                  onLoadedMetadata={handleVideoMetadata}
                >
                  Your browser does not support the video tag.
                </video>
              ) : isYouTube ? (
                <iframe
                  src={getYouTubeEmbedUrl(video.videoUrl)}
                  className="w-full h-full min-h-[200px] sm:min-h-[300px] md:min-h-[400px] aspect-video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : isVimeo ? (
                <iframe
                  src={getVimeoEmbedUrl(video.videoUrl)}
                  className="w-full h-full min-h-[200px] sm:min-h-[300px] md:min-h-[400px] aspect-video"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <iframe
                  src={video.videoUrl}
                  className="w-full h-full min-h-[200px] sm:min-h-[300px] md:min-h-[400px] aspect-video"
                  allowFullScreen
                />
              )}
            </div>

            {/* Video Description - Scrollable on mobile */}
            {video.description && (
              <p className="mt-2 sm:mt-4 text-muted-foreground text-xs sm:text-sm md:text-base px-2 line-clamp-3 sm:line-clamp-none">
                {video.description}
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
