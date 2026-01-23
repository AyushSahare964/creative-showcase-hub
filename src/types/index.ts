export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  category: string;
  duration: string;
  createdAt: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string;
  projectType: string;
  budget: string;
  message: string;
  createdAt: string;
  status: 'new' | 'contacted' | 'in-progress' | 'completed';
}

export interface EditorProfile {
  name: string;
  title: string;
  bio: string;
  avatar: string;
  experience: string;
  projectsCompleted: number;
  email: string;
  phone: string;
  location: string;
  socialLinks: {
    youtube?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
  };
}
