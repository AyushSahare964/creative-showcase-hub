import { Video, ContactSubmission, EditorProfile } from "@/types";
import videoThumb1 from "@/assets/video-thumb-1.jpg";
import videoThumb2 from "@/assets/video-thumb-2.jpg";
import videoThumb3 from "@/assets/video-thumb-3.jpg";
import videoThumb4 from "@/assets/video-thumb-4.jpg";
import videoThumb5 from "@/assets/video-thumb-5.jpg";
import videoThumb6 from "@/assets/video-thumb-6.jpg";

export const editorProfile: EditorProfile = {
  name: "Alex Rivera",
  title: "Professional Video Editor & Motion Designer",
  bio: "With over 8 years of experience in video editing and motion graphics, I transform raw footage into compelling visual stories. Specializing in commercial ads, music videos, documentaries, and social media content.",
  avatar: "",
  experience: "8+ Years",
  projectsCompleted: 500,
  email: "alex@videocraft.studio",
  phone: "+1 (555) 123-4567",
  location: "Los Angeles, CA",
  socialLinks: {
    youtube: "https://youtube.com",
    instagram: "https://instagram.com",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
  },
};

export const videos: Video[] = [
  {
    id: "1",
    title: "Brand Commercial - Luxury Fashion",
    description: "High-end fashion brand commercial with cinematic color grading and smooth transitions.",
    thumbnail: videoThumb4,
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    category: "Commercial",
    duration: "0:45",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    title: "Music Video - Electronic Dreams",
    description: "Dynamic music video featuring VFX elements and creative editing techniques.",
    thumbnail: videoThumb2,
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    category: "Music Video",
    duration: "3:24",
    createdAt: "2024-01-10",
  },
  {
    id: "3",
    title: "Documentary - Urban Stories",
    description: "Documentary-style video with narrative pacing and emotional storytelling.",
    thumbnail: videoThumb3,
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    category: "Documentary",
    duration: "12:30",
    createdAt: "2024-01-05",
  },
  {
    id: "4",
    title: "Product Launch - Tech Startup",
    description: "Product reveal video with motion graphics and 3D elements.",
    thumbnail: videoThumb1,
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    category: "Commercial",
    duration: "1:15",
    createdAt: "2023-12-20",
  },
  {
    id: "5",
    title: "Wedding Highlights - Beach Ceremony",
    description: "Romantic wedding video with cinematic color grading and emotional moments.",
    thumbnail: videoThumb5,
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    category: "Wedding",
    duration: "8:45",
    createdAt: "2023-12-15",
  },
  {
    id: "6",
    title: "Social Media Reel - Fitness Brand",
    description: "High-energy fitness content optimized for Instagram and TikTok.",
    thumbnail: videoThumb6,
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    category: "Social Media",
    duration: "0:30",
    createdAt: "2023-12-10",
  },
];

export const mockSubmissions: ContactSubmission[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah@company.com",
    phone: "+1 555-0123",
    projectType: "Commercial",
    budget: "$5,000 - $10,000",
    message: "Looking for a 30-second commercial for our new product launch.",
    createdAt: "2024-01-20T10:30:00Z",
    status: "new",
  },
  {
    id: "2",
    name: "Mike Chen",
    email: "mike@studio.com",
    phone: "+1 555-0456",
    projectType: "Music Video",
    budget: "$2,000 - $5,000",
    message: "Need a music video for my upcoming single release.",
    createdAt: "2024-01-19T14:15:00Z",
    status: "contacted",
  },
];
