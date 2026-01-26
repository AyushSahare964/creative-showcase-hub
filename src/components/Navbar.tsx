import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Portfolio", href: "/#portfolio" },
  { name: "About", href: "/#about" },
  { name: "Contact", href: "/#contact" },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    setIsOpen(false);
    
    if (href === "/") {
      navigate("/");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    
    if (href.startsWith("/#")) {
      const id = href.replace("/#", "");
      
      // If we're not on home page, navigate first
      if (location.pathname !== "/") {
        navigate("/");
        // Wait for navigation then scroll
        setTimeout(() => {
          const element = document.getElementById(id);
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          }
        }, 100);
      } else {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  };

  const handleDashboardClick = () => {
    setIsOpen(false);
    navigate("/dashboard");
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/90 backdrop-blur-xl border-b border-border/50" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo + Name + Dashboard (Mobile) */}
          <div className="flex items-center gap-2 md:gap-3">
            <Link to="/" className="flex items-center gap-2 md:gap-3 group">
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-lg shadow-primary/25">
                <span className="font-display text-base md:text-lg text-primary-foreground font-bold">SK</span>
              </div>
              <span className="font-display text-sm md:text-xl tracking-wider">SANSHAG KARWADE</span>
            </Link>
            {/* Dashboard button - visible on mobile next to logo */}
            <button 
              onClick={handleDashboardClick}
              className="md:hidden p-2 hover:bg-secondary rounded-lg transition-colors"
              title="Editor Dashboard"
            >
              <LayoutDashboard className="w-4 h-4" />
            </button>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => scrollToSection(link.href)}
                className="text-muted-foreground hover:text-foreground transition-colors duration-300 text-sm uppercase tracking-wider"
              >
                {link.name}
              </button>
            ))}
            <Link to="/dashboard">
              <Button variant="ghost" size="icon" className="mr-2" title="Editor Dashboard">
                <LayoutDashboard className="w-5 h-5" />
              </Button>
            </Link>
            <Button variant="hero" size="lg" onClick={() => scrollToSection("/#contact")}>
              Hire Me
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border"
          >
            <div className="container mx-auto px-4 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => scrollToSection(link.href)}
                  className="text-muted-foreground hover:text-foreground transition-colors py-2 text-left uppercase tracking-wider"
                >
                  {link.name}
                </button>
              ))}
              <Button variant="hero" className="mt-4" onClick={() => scrollToSection("/#contact")}>
                Hire Me
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};
