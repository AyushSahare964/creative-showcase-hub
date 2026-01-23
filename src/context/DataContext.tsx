import React, { createContext, useContext, useState, ReactNode } from "react";
import { Video, ContactSubmission, EditorProfile } from "@/types";
import { videos as initialVideos, mockSubmissions, editorProfile as initialProfile } from "@/data/mockData";

interface DataContextType {
  videos: Video[];
  setVideos: React.Dispatch<React.SetStateAction<Video[]>>;
  submissions: ContactSubmission[];
  setSubmissions: React.Dispatch<React.SetStateAction<ContactSubmission[]>>;
  profile: EditorProfile;
  setProfile: React.Dispatch<React.SetStateAction<EditorProfile>>;
  addVideo: (video: Omit<Video, "id" | "createdAt">) => void;
  updateVideo: (id: string, video: Partial<Video>) => void;
  deleteVideo: (id: string) => void;
  addSubmission: (submission: Omit<ContactSubmission, "id" | "createdAt" | "status">) => void;
  updateSubmissionStatus: (id: string, status: ContactSubmission["status"]) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [videos, setVideos] = useState<Video[]>(initialVideos);
  const [submissions, setSubmissions] = useState<ContactSubmission[]>(mockSubmissions);
  const [profile, setProfile] = useState<EditorProfile>(initialProfile);

  const addVideo = (video: Omit<Video, "id" | "createdAt">) => {
    const newVideo: Video = {
      ...video,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setVideos((prev) => [newVideo, ...prev]);
  };

  const updateVideo = (id: string, videoData: Partial<Video>) => {
    setVideos((prev) =>
      prev.map((video) => (video.id === id ? { ...video, ...videoData } : video))
    );
  };

  const deleteVideo = (id: string) => {
    setVideos((prev) => prev.filter((video) => video.id !== id));
  };

  const addSubmission = (submission: Omit<ContactSubmission, "id" | "createdAt" | "status">) => {
    const newSubmission: ContactSubmission = {
      ...submission,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: "new",
    };
    setSubmissions((prev) => [newSubmission, ...prev]);
  };

  const updateSubmissionStatus = (id: string, status: ContactSubmission["status"]) => {
    setSubmissions((prev) =>
      prev.map((sub) => (sub.id === id ? { ...sub, status } : sub))
    );
  };

  return (
    <DataContext.Provider
      value={{
        videos,
        setVideos,
        submissions,
        setSubmissions,
        profile,
        setProfile,
        addVideo,
        updateVideo,
        deleteVideo,
        addSubmission,
        updateSubmissionStatus,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
