import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, AlertTriangle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20">
      <Card className="max-w-md w-full mx-4">
        <CardContent className="p-8 text-center space-y-6">
          <div className="space-y-4">
            <AlertTriangle className="h-16 w-16 mx-auto text-muted-foreground" />
            <div className="space-y-2">
              <h1 className="text-4xl font-bold">404</h1>
              <h2 className="text-xl font-semibold">Page Not Found</h2>
              <p className="text-muted-foreground">
                The page you're looking for doesn't exist or has been moved.
              </p>
            </div>
          </div>
          
          <Button asChild className="w-full">
            <a href="/" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Return to Home
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
