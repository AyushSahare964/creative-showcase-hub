import { useState } from "react";
import { motion } from "framer-motion";
import { VideoCard } from "./VideoCard";
import { useData } from "@/context/DataContext";

const categories = ["All", "Commercial", "Music Video", "Documentary", "Wedding", "Social Media"];

export const PortfolioSection = () => {
  const { videos } = useData();
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredVideos = activeCategory === "All" 
    ? videos 
    : videos.filter((v) => v.category === activeCategory);

  return (
    <section id="portfolio" className="py-24 bg-card/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary uppercase tracking-widest text-sm mb-4 block">Portfolio</span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl mb-4">
            FEATURED <span className="text-gradient">WORK</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            A collection of my best video editing projects across various genres and styles.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2 rounded-full text-sm transition-all duration-300 ${
                activeCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border hover:border-primary/50 text-muted-foreground hover:text-foreground"
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Video Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredVideos.map((video, index) => (
            <VideoCard key={video.id} video={video} index={index} />
          ))}
        </motion.div>

        {filteredVideos.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No videos found in this category.
          </div>
        )}
      </div>
    </section>
  );
};
