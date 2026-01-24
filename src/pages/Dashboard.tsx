import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  Film, 
  Users, 
  Settings, 
  Plus, 
  Trash2, 
  Mail, 
  Phone, 
  Clock,
  Eye,
  LogOut,
  Menu,
  X,
  Upload,
  Link as LinkIcon,
  Video
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useData } from "@/context/DataContext";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Tab = "overview" | "videos" | "submissions" | "settings";
type VideoInputMode = "url" | "upload";

const Dashboard = () => {
  const { videos, submissions, profile, addVideo, deleteVideo, updateSubmissionStatus, setProfile } = useData();
  const { user, loading, isEditor, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAddVideoOpen, setIsAddVideoOpen] = useState(false);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [videoUploadProgress, setVideoUploadProgress] = useState(0);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
  const [videoInputMode, setVideoInputMode] = useState<VideoInputMode>("upload");
  const [videoFileName, setVideoFileName] = useState<string>("");
  const [newVideo, setNewVideo] = useState({
    title: "",
    description: "",
    videoUrl: "",
    category: "Commercial",
    duration: "",
    thumbnail: "",
  });

  // Redirect if not authenticated or not the editor
  useEffect(() => {
    if (!loading && (!user || !isEditor)) {
      navigate("/auth");
    }
  }, [user, loading, isEditor, navigate]);

  const handleLogout = async () => {
    await signOut();
    toast({
      title: "Logged out",
      description: "You have been signed out successfully.",
    });
    navigate("/");
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file",
        description: "Please upload an image file.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    setUploadingThumbnail(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `thumbnails/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("video-thumbnails")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("video-thumbnails")
        .getPublicUrl(filePath);

      setNewVideo({ ...newVideo, thumbnail: publicUrl });
      setThumbnailPreview(publicUrl);
      
      toast({
        title: "Thumbnail uploaded",
        description: "Your thumbnail has been uploaded successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload thumbnail.",
        variant: "destructive",
      });
    } finally {
      setUploadingThumbnail(false);
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["video/mp4", "video/webm", "video/quicktime", "video/x-msvideo"];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file",
        description: "Please upload a video file (MP4, WebM, MOV, AVI).",
        variant: "destructive",
      });
      return;
    }

    // Max 500MB for videos
    if (file.size > 500 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a video smaller than 500MB.",
        variant: "destructive",
      });
      return;
    }

    setUploadingVideo(true);
    setVideoFileName(file.name);
    setVideoUploadProgress(0);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      // Simulate progress (Supabase doesn't expose upload progress for small files)
      const progressInterval = setInterval(() => {
        setVideoUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      const { error: uploadError } = await supabase.storage
        .from("videos")
        .upload(filePath, file);

      clearInterval(progressInterval);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("videos")
        .getPublicUrl(filePath);

      setNewVideo({ ...newVideo, videoUrl: publicUrl });
      setVideoUploadProgress(100);
      
      toast({
        title: "Video uploaded!",
        description: "Your video has been uploaded successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload video.",
        variant: "destructive",
      });
      setVideoFileName("");
    } finally {
      setUploadingVideo(false);
    }
  };

  const handleAddVideo = () => {
    if (!newVideo.title || !newVideo.videoUrl) {
      toast({
        title: "Error",
        description: "Please fill in title and add a video",
        variant: "destructive",
      });
      return;
    }
    addVideo(newVideo);
    setNewVideo({
      title: "",
      description: "",
      videoUrl: "",
      category: "Commercial",
      duration: "",
      thumbnail: "",
    });
    setThumbnailPreview("");
    setVideoFileName("");
    setVideoUploadProgress(0);
    setIsAddVideoOpen(false);
    toast({
      title: "Video Added",
      description: "Your new video has been added to the portfolio.",
    });
  };

  const resetForm = () => {
    setNewVideo({
      title: "",
      description: "",
      videoUrl: "",
      category: "Commercial",
      duration: "",
      thumbnail: "",
    });
    setThumbnailPreview("");
    setVideoFileName("");
    setVideoUploadProgress(0);
  };

  const tabs = [
    { id: "overview" as Tab, label: "Overview", icon: LayoutDashboard },
    { id: "videos" as Tab, label: "Videos", icon: Film },
    { id: "submissions" as Tab, label: "Inquiries", icon: Users },
    { id: "settings" as Tab, label: "Settings", icon: Settings },
  ];

  const newSubmissions = submissions.filter((s) => s.status === "new").length;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isEditor) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile Menu Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-card rounded-lg border border-border"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-card border-r border-border transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
              <span className="font-display text-sm text-primary-foreground font-bold">SK</span>
            </div>
            <span className="font-display text-lg tracking-wider text-gradient">SANSHAG</span>
          </Link>
          <p className="text-sm text-muted-foreground mt-1">Editor Dashboard</p>
        </div>

        <nav className="px-4 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
              {tab.id === "submissions" && newSubmissions > 0 && (
                <span className="ml-auto px-2 py-0.5 rounded-full bg-destructive text-destructive-foreground text-xs">
                  {newSubmissions}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border space-y-2">
          <Link to="/">
            <Button variant="ghost" className="w-full justify-start gap-3">
              <Eye className="w-5 h-5" />
              View Portfolio
            </Button>
          </Link>
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 text-destructive hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-8">
              <h1 className="font-display text-3xl">Dashboard Overview</h1>
              <span className="text-sm text-muted-foreground">Welcome, Sanshag!</span>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="glass-card rounded-xl p-6">
                <Film className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-display text-3xl">{videos.length}</h3>
                <p className="text-muted-foreground">Total Videos</p>
              </div>
              <div className="glass-card rounded-xl p-6">
                <Users className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-display text-3xl">{submissions.length}</h3>
                <p className="text-muted-foreground">Total Inquiries</p>
              </div>
              <div className="glass-card rounded-xl p-6">
                <Mail className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-display text-3xl">{newSubmissions}</h3>
                <p className="text-muted-foreground">New Inquiries</p>
              </div>
              <div className="glass-card rounded-xl p-6">
                <Clock className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-display text-3xl">{profile.experience}</h3>
                <p className="text-muted-foreground">Experience</p>
              </div>
            </div>

            {/* Recent Submissions */}
            <div className="glass-card rounded-xl p-6">
              <h2 className="font-display text-xl mb-4">Recent Inquiries</h2>
              <div className="space-y-4">
                {submissions.slice(0, 5).map((sub) => (
                  <div
                    key={sub.id}
                    className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium">{sub.name}</h4>
                      <p className="text-sm text-muted-foreground">{sub.projectType}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        sub.status === "new"
                          ? "bg-primary/20 text-primary"
                          : sub.status === "contacted"
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-green-500/20 text-green-400"
                      }`}
                    >
                      {sub.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Videos Tab */}
        {activeTab === "videos" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-8">
              <h1 className="font-display text-3xl">Manage Videos</h1>
              <Dialog open={isAddVideoOpen} onOpenChange={(open) => {
                setIsAddVideoOpen(open);
                if (!open) resetForm();
              }}>
                <DialogTrigger asChild>
                  <Button variant="hero">
                    <Plus className="w-5 h-5" />
                    Add Video
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="font-display text-2xl">Add New Video</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    {/* Video Input Mode Toggle */}
                    <div>
                      <label className="block text-sm font-medium mb-3">Video Source *</label>
                      <div className="flex gap-2 mb-4">
                        <button
                          type="button"
                          onClick={() => {
                            setVideoInputMode("upload");
                            setNewVideo({ ...newVideo, videoUrl: "" });
                            setVideoFileName("");
                          }}
                          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-all ${
                            videoInputMode === "upload"
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-secondary/50 border-border hover:border-primary/50"
                          }`}
                        >
                          <Upload className="w-4 h-4" />
                          Upload File
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setVideoInputMode("url");
                            setNewVideo({ ...newVideo, videoUrl: "" });
                            setVideoFileName("");
                          }}
                          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-all ${
                            videoInputMode === "url"
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-secondary/50 border-border hover:border-primary/50"
                          }`}
                        >
                          <LinkIcon className="w-4 h-4" />
                          URL / Embed
                        </button>
                      </div>

                      {videoInputMode === "upload" ? (
                        <div 
                          className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
                          onClick={() => !uploadingVideo && videoInputRef.current?.click()}
                        >
                          {uploadingVideo ? (
                            <div className="space-y-3">
                              <Video className="w-10 h-10 mx-auto text-primary animate-pulse" />
                              <p className="text-sm text-muted-foreground">Uploading {videoFileName}...</p>
                              <div className="w-full bg-secondary rounded-full h-2">
                                <div 
                                  className="bg-primary h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${videoUploadProgress}%` }}
                                />
                              </div>
                              <p className="text-xs text-muted-foreground">{videoUploadProgress}%</p>
                            </div>
                          ) : videoFileName && newVideo.videoUrl ? (
                            <div className="space-y-2">
                              <Video className="w-10 h-10 mx-auto text-green-500" />
                              <p className="text-sm text-foreground font-medium">{videoFileName}</p>
                              <p className="text-xs text-green-500">Upload complete!</p>
                              <button 
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setNewVideo({ ...newVideo, videoUrl: "" });
                                  setVideoFileName("");
                                  setVideoUploadProgress(0);
                                }}
                                className="text-xs text-muted-foreground underline"
                              >
                                Remove and upload different video
                              </button>
                            </div>
                          ) : (
                            <>
                              <Video className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                              <p className="text-sm text-muted-foreground">Click to upload video</p>
                              <p className="text-xs text-muted-foreground mt-1">MP4, WebM, MOV up to 500MB</p>
                            </>
                          )}
                          <input
                            ref={videoInputRef}
                            type="file"
                            accept="video/mp4,video/webm,video/quicktime,video/x-msvideo"
                            className="hidden"
                            onChange={handleVideoUpload}
                          />
                        </div>
                      ) : (
                        <Input
                          value={newVideo.videoUrl}
                          onChange={(e) => setNewVideo({ ...newVideo, videoUrl: e.target.value })}
                          placeholder="YouTube, Vimeo, or direct video URL"
                        />
                      )}
                    </div>

                    {/* Thumbnail Upload */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Thumbnail</label>
                      <div 
                        className="border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:border-primary/50 transition-colors"
                        onClick={() => thumbnailInputRef.current?.click()}
                      >
                        {thumbnailPreview ? (
                          <div className="relative">
                            <img 
                              src={thumbnailPreview} 
                              alt="Thumbnail preview" 
                              className="w-full aspect-video object-cover rounded-lg"
                            />
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-lg">
                              <span className="text-white text-sm">Click to change</span>
                            </div>
                          </div>
                        ) : (
                          <div className="py-6">
                            {uploadingThumbnail ? (
                              <div className="flex flex-col items-center gap-2">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                                <span className="text-sm text-muted-foreground">Uploading...</span>
                              </div>
                            ) : (
                              <>
                                <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                                <span className="text-sm text-muted-foreground">Upload thumbnail (optional)</span>
                                <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB</p>
                              </>
                            )}
                          </div>
                        )}
                        <input
                          ref={thumbnailInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleThumbnailUpload}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Title *</label>
                      <Input
                        value={newVideo.title}
                        onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                        placeholder="Video title"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Category</label>
                        <select
                          value={newVideo.category}
                          onChange={(e) => setNewVideo({ ...newVideo, category: e.target.value })}
                          className="flex h-12 w-full rounded-lg border border-border bg-card/50 px-4 py-3 text-base"
                        >
                          <option>Commercial</option>
                          <option>Music Video</option>
                          <option>Documentary</option>
                          <option>Wedding</option>
                          <option>Social Media</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Duration</label>
                        <Input
                          value={newVideo.duration}
                          onChange={(e) => setNewVideo({ ...newVideo, duration: e.target.value })}
                          placeholder="e.g., 2:30"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Description</label>
                      <Textarea
                        value={newVideo.description}
                        onChange={(e) => setNewVideo({ ...newVideo, description: e.target.value })}
                        placeholder="Video description"
                        rows={3}
                      />
                    </div>
                    <Button 
                      variant="hero" 
                      className="w-full" 
                      onClick={handleAddVideo}
                      disabled={uploadingVideo || uploadingThumbnail}
                    >
                      Add Video
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <div key={video.id} className="glass-card rounded-xl overflow-hidden">
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center overflow-hidden">
                    {video.thumbnail ? (
                      <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                    ) : (
                      <Film className="w-12 h-12 text-primary/50" />
                    )}
                  </div>
                  <div className="p-4">
                    <span className="text-xs text-primary">{video.category}</span>
                    <h3 className="font-semibold mt-1 line-clamp-1">{video.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {video.description}
                    </p>
                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteVideo(video.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Submissions Tab */}
        {activeTab === "submissions" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="font-display text-3xl mb-8">Client Inquiries</h1>

            <div className="space-y-4">
              {submissions.map((sub) => (
                <div key={sub.id} className="glass-card rounded-xl p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{sub.name}</h3>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          {sub.email}
                        </span>
                        {sub.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-4 h-4" />
                            {sub.phone}
                          </span>
                        )}
                      </div>
                    </div>
                    <select
                      value={sub.status}
                      onChange={(e) =>
                        updateSubmissionStatus(sub.id, e.target.value as any)
                      }
                      className="px-4 py-2 rounded-lg bg-secondary text-sm border border-border"
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-secondary/50 rounded-lg p-3">
                      <span className="text-xs text-muted-foreground">Project Type</span>
                      <p className="font-medium">{sub.projectType}</p>
                    </div>
                    <div className="bg-secondary/50 rounded-lg p-3">
                      <span className="text-xs text-muted-foreground">Budget</span>
                      <p className="font-medium">{sub.budget || "Not specified"}</p>
                    </div>
                  </div>

                  <div className="bg-secondary/50 rounded-lg p-3">
                    <span className="text-xs text-muted-foreground">Message</span>
                    <p className="mt-1">{sub.message}</p>
                  </div>

                  <p className="text-xs text-muted-foreground mt-4">
                    Received: {new Date(sub.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="font-display text-3xl mb-8">Profile Settings</h1>

            <div className="glass-card rounded-xl p-6 max-w-2xl">
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name</label>
                    <Input
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Title</label>
                    <Input
                      value={profile.title}
                      onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <Input
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone</label>
                    <Input
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Location</label>
                    <Input
                      value={profile.location}
                      onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Experience</label>
                    <Input
                      value={profile.experience}
                      onChange={(e) => setProfile({ ...profile, experience: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Bio</label>
                  <Textarea
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Skills (comma separated)</label>
                  <Input
                    value={profile.skills?.join(", ") || ""}
                    onChange={(e) => setProfile({ 
                      ...profile, 
                      skills: e.target.value.split(",").map(s => s.trim()).filter(Boolean)
                    })}
                    placeholder="Adobe Premiere Pro, After Effects, DaVinci Resolve"
                  />
                </div>

                <Button
                  variant="hero"
                  onClick={() =>
                    toast({ title: "Settings Saved", description: "Your profile has been updated." })
                  }
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
