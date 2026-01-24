import { useState } from "react";
import { motion } from "framer-motion";
import { Play, X, Clock, Tag } from "lucide-react";
import { Video } from "@/types";
import { VideoPlayerModal } from "./VideoPlayerModal";

interface VideoCardProps {
  video: Video;
  index: number;
}

export const VideoCard = ({ video, index }: VideoCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="group relative overflow-hidden rounded-xl bg-card border border-border/50 cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        {/* Thumbnail */}
        <div className="aspect-video relative overflow-hidden">
          {video.thumbnail ? (
            <img 
              src={video.thumbnail} 
              alt={video.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <Play className="w-12 h-12 text-primary/50" />
            </div>
          )}
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
          
          {/* Play Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-100 scale-75 backdrop-blur-sm">
              <Play className="w-6 h-6 text-primary-foreground fill-current ml-1" />
            </div>
          </div>

          {/* Duration Badge */}
          {video.duration && (
            <div className="absolute top-3 right-3 px-2 py-1 rounded bg-background/80 backdrop-blur-sm text-xs flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {video.duration}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs flex items-center gap-1">
              <Tag className="w-3 h-3" />
              {video.category}
            </span>
          </div>
          <h3 className="font-semibold text-foreground mb-1 line-clamp-1 group-hover:text-primary transition-colors">
            {video.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {video.description}
          </p>
        </div>
      </motion.div>

      {/* Video Player Modal */}
      <VideoPlayerModal 
        video={video} 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
      />
    </>
  );
};
