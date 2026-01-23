import { useState } from "react";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  Film, 
  Users, 
  Settings, 
  Plus, 
  Edit2, 
  Trash2, 
  Mail, 
  Phone, 
  Clock,
  Eye,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useData } from "@/context/DataContext";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Tab = "overview" | "videos" | "submissions" | "settings";

const Dashboard = () => {
  const { videos, submissions, profile, addVideo, updateVideo, deleteVideo, updateSubmissionStatus, setProfile } = useData();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAddVideoOpen, setIsAddVideoOpen] = useState(false);
  const [newVideo, setNewVideo] = useState({
    title: "",
    description: "",
    videoUrl: "",
    category: "Commercial",
    duration: "",
    thumbnail: "",
  });

  const handleAddVideo = () => {
    if (!newVideo.title || !newVideo.videoUrl) {
      toast({
        title: "Error",
        description: "Please fill in required fields",
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
    setIsAddVideoOpen(false);
    toast({
      title: "Video Added",
      description: "Your new video has been added to the portfolio.",
    });
  };

  const tabs = [
    { id: "overview" as Tab, label: "Overview", icon: LayoutDashboard },
    { id: "videos" as Tab, label: "Videos", icon: Film },
    { id: "submissions" as Tab, label: "Inquiries", icon: Users },
    { id: "settings" as Tab, label: "Settings", icon: Settings },
  ];

  const newSubmissions = submissions.filter((s) => s.status === "new").length;

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
          <Link to="/" className="font-display text-2xl tracking-wider text-gradient">
            VIDEOCRAFT
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

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
          <Link to="/">
            <Button variant="ghost" className="w-full justify-start gap-3">
              <Eye className="w-5 h-5" />
              View Portfolio
            </Button>
          </Link>
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
            <h1 className="font-display text-3xl mb-8">Dashboard Overview</h1>

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
              <Dialog open={isAddVideoOpen} onOpenChange={setIsAddVideoOpen}>
                <DialogTrigger asChild>
                  <Button variant="hero">
                    <Plus className="w-5 h-5" />
                    Add Video
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle className="font-display text-2xl">Add New Video</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Title *</label>
                      <Input
                        value={newVideo.title}
                        onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                        placeholder="Video title"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Video URL *</label>
                      <Input
                        value={newVideo.videoUrl}
                        onChange={(e) => setNewVideo({ ...newVideo, videoUrl: e.target.value })}
                        placeholder="YouTube embed URL"
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
                    <Button variant="hero" className="w-full" onClick={handleAddVideo}>
                      Add Video
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <div key={video.id} className="glass-card rounded-xl overflow-hidden">
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <Film className="w-12 h-12 text-primary/50" />
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
