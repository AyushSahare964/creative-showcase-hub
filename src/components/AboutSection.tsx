import { motion } from "framer-motion";
import { Youtube, Instagram, Linkedin, Twitter, MapPin, Mail, Phone } from "lucide-react";
import { useData } from "@/context/DataContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const skills = [
  { name: "Premiere Pro", level: 95 },
  { name: "After Effects", level: 90 },
  { name: "DaVinci Resolve", level: 85 },
  { name: "Final Cut Pro", level: 80 },
  { name: "Motion Graphics", level: 88 },
  { name: "Color Grading", level: 92 },
];

export const AboutSection = () => {
  const { profile } = useData();

  const scrollToContact = () => {
    const element = document.getElementById("contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="about" className="py-24">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Image/Visual */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5 border border-border/50">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  {profile.avatar ? (
                    <Avatar className="w-40 h-40 mx-auto mb-6 ring-4 ring-primary/30">
                      <AvatarImage src={profile.avatar} alt={profile.name} className="object-cover" />
                      <AvatarFallback className="bg-primary/20 text-primary text-5xl font-display">
                        {profile.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-primary/20 mx-auto mb-6 flex items-center justify-center">
                      <span className="font-display text-5xl text-primary">
                        {profile.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <h3 className="font-display text-3xl mb-2">{profile.name}</h3>
                  <p className="text-muted-foreground">{profile.title}</p>
                </div>
              </div>
            </div>

            {/* Floating Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="absolute -bottom-8 -right-8 glass-card rounded-xl p-6 max-w-xs"
            >
              <div className="flex items-center gap-3 mb-3">
                <MapPin className="w-5 h-5 text-primary" />
                <span>{profile.location}</span>
              </div>
              <div className="flex gap-3">
                {profile.socialLinks.youtube && (
                  <a href={profile.socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                    <Youtube className="w-5 h-5" />
                  </a>
                )}
                {profile.socialLinks.instagram && (
                  <a href={profile.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                    <Instagram className="w-5 h-5" />
                  </a>
                )}
                {profile.socialLinks.linkedin && (
                  <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                    <Linkedin className="w-5 h-5" />
                  </a>
                )}
                {profile.socialLinks.twitter && (
                  <a href={profile.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                    <Twitter className="w-5 h-5" />
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>

          {/* Right - Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-primary uppercase tracking-widest text-sm mb-4 block">About Me</span>
            <h2 className="font-display text-4xl md:text-5xl mb-6">
              PASSIONATE <span className="text-gradient">STORYTELLER</span>
            </h2>
            <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
              {profile.bio}
            </p>

            {/* Skills */}
            <div className="space-y-4 mb-8">
              {skills.map((skill, index) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">{skill.name}</span>
                    <span className="text-sm text-muted-foreground">{skill.level}%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full"
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Contact Info */}
            <div className="flex flex-wrap gap-6 mb-8">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4 text-primary" />
                <span>{profile.email}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="w-4 h-4 text-primary" />
                <span>{profile.phone}</span>
              </div>
            </div>

            <Button variant="hero" size="lg" onClick={scrollToContact}>
              Let's Work Together
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
