import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Only the editor can login - hardcoded editor email
const EDITOR_EMAIL = "sanshagkarwade@gmail.com";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if already logged in
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user?.email === EDITOR_EMAIL) {
        navigate("/dashboard");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.email === EDITOR_EMAIL) {
        navigate("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Check if the email is the editor's email
    if (email.toLowerCase() !== EDITOR_EMAIL) {
      setError("Access denied. Only the editor can login to this dashboard.");
      setLoading(false);
      return;
    }

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      if (authError.message.includes("Invalid login credentials")) {
        setError("Invalid email or password. Please try again.");
      } else {
        setError(authError.message);
      }
      setLoading(false);
      return;
    }

    toast({
      title: "Welcome back, Sanshag!",
      description: "Successfully logged into your dashboard.",
    });
    navigate("/dashboard");
    setLoading(false);
  };

  const handleSignUp = async () => {
    setError("");
    setLoading(true);

    if (email.toLowerCase() !== EDITOR_EMAIL) {
      setError("Only the editor (Sanshag Karwade) can create an account.");
      setLoading(false);
      return;
    }

    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (authError) {
      if (authError.message.includes("already registered")) {
        setError("This email is already registered. Please login instead.");
      } else {
        setError(authError.message);
      }
      setLoading(false);
      return;
    }

    toast({
      title: "Account created!",
      description: "You can now login to your dashboard.",
    });
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-card" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="glass-card rounded-2xl p-8">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg shadow-primary/25">
              <span className="font-display text-2xl text-primary-foreground font-bold">SK</span>
            </div>
          </div>
          <h1 className="font-display text-2xl text-center tracking-wider">SANSHAG KARWADE</h1>
          <p className="text-muted-foreground text-center text-sm mb-8 mt-2">
            Editor Dashboard Access
          </p>
          <p className="text-muted-foreground text-center text-sm mb-8">
            Access restricted to Sanshag Karwade
          </p>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sanshagkarwade@gmail.com"
                    className="pl-12"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-12"
                    required
                    minLength={6}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                type="submit"
                variant="hero"
                size="lg"
                className="w-full"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>

              <Button
                type="button"
                variant="ghost"
                className="w-full text-muted-foreground"
                onClick={handleSignUp}
                disabled={loading}
              >
                First time? Create account
              </Button>
            </div>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-6">
            This dashboard is exclusively for Sanshag Karwade
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
