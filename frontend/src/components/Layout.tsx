import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, FileText, Activity, Sun, Moon, Play, Users } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gradient-dashboard">
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                UI Feedback System
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant={location.pathname === "/" ? "secondary" : "ghost"}
                asChild
                size="sm"
              >
                <Link to="/">
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Link>
              </Button>
              <Button
                variant={location.pathname === "/start" ? "secondary" : "ghost"}
                asChild
                size="sm"
              >
                <Link to="/start">
                  <Play className="h-4 w-4 mr-2" />
                  Start Analysis
                </Link>
              </Button>
              <Button
                variant={location.pathname === "/about" ? "secondary" : "ghost"}
                asChild
                size="sm"
              >
                <Link to="/about">
                  <Users className="h-4 w-4 mr-2" />
                  About
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              >
                {theme === "light" ? (
                  <Moon className="h-4 w-4" />
                ) : (
                  <Sun className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant={location.pathname.startsWith("/reports") ? "secondary" : "outline"}
                asChild
                size="sm"
                className="ml-4"
              >
                <Link to="/reports">
                  <FileText className="h-4 w-4 mr-2" />
                  View all reports
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>
      {children}
    </div>
  );
};