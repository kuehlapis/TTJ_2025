import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { 
  Globe, 
  Smartphone, 
  Tablet, 
  Monitor, 
  Zap, 
  Eye, 
  AlertTriangle, 
  TrendingUp,
  Play,
  Settings,
  Clock
} from "lucide-react";

const StartAnalysis = () => {
  const [url, setUrl] = useState("");
  const [device, setDevice] = useState("");
  const [analyses, setAnalyses] = useState({
    consistency: true,
    exceptions: true,
    satisfaction: true,
    efficiency: true
  });
  const [isRunning, setIsRunning] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const deviceOptions = [
    { value: "iphone-14-pro", label: "iPhone 14 Pro", icon: Smartphone },
    { value: "samsung-galaxy-s23", label: "Samsung Galaxy S23", icon: Smartphone },
    { value: "ipad-pro", label: "iPad Pro", icon: Tablet },
    { value: "desktop-1920", label: "Desktop (1920x1080)", icon: Monitor },
    { value: "desktop-4k", label: "Desktop (4K)", icon: Monitor }
  ];

  const analysisTypes = [
    {
      key: "consistency",
      title: "Consistency Verification",
      description: "Compare visual screenshots with DOM structure",
      icon: Eye,
      estimated: "800ms"
    },
    {
      key: "exceptions",
      title: "Exception Detection", 
      description: "Identify popups, crashes, overlaps, and anomalies",
      icon: AlertTriangle,
      estimated: "600ms"
    },
    {
      key: "satisfaction", 
      title: "Satisfaction Scoring",
      description: "UX quality assessment with rubric scoring",
      icon: TrendingUp,
      estimated: "900ms"
    },
    {
      key: "efficiency",
      title: "Efficiency Analysis",
      description: "Performance optimization suggestions",
      icon: Zap,
      estimated: "400ms"
    }
  ];

  const handleAnalysisToggle = (key: string) => {
    setAnalyses(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }));
  };

  const getEstimatedTime = () => {
    const times = {
      consistency: 800,
      exceptions: 600, 
      satisfaction: 900,
      efficiency: 400
    };
    
    const totalTime = Object.entries(analyses)
      .filter(([_, enabled]) => enabled)
      .reduce((sum, [key]) => sum + times[key as keyof typeof times], 0);
    
    return Math.round(totalTime + 500); // Add base processing time
  };

  const validateUrl = (url: string) => {
    try {
      new URL(url);
      return url.startsWith('http://') || url.startsWith('https://');
    } catch {
      return false;
    }
  };

  const handleStartAnalysis = async () => {
    if (!url) {
      toast({
        title: "URL Required",
        description: "Please enter a valid website URL",
        variant: "destructive"
      });
      return;
    }

    if (!validateUrl(url)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL starting with http:// or https://",
        variant: "destructive"
      });
      return;
    }

    if (!device) {
      toast({
        title: "Device Required",
        description: "Please select a device for analysis",
        variant: "destructive"
      });
      return;
    }

    const enabledAnalyses = Object.entries(analyses)
      .filter(([_, enabled]) => enabled)
      .map(([key]) => key);
    
    if (enabledAnalyses.length === 0) {
      toast({
        title: "No Analysis Selected",
        description: "Please select at least one analysis type",
        variant: "destructive"
      });
      return;
    }

    setIsRunning(true);
    
    try {
      // Simulate POST /analyses with payload
      const payload = {
        url,
        device,
        analysis_types: enabledAnalyses
      };
      
      console.log('Starting analysis with:', payload);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate success response with analysis_id
      const analysisId = `analysis_${Date.now()}`;
      
      toast({
        title: "Analysis Started",
        description: `Running ${enabledAnalyses.length} analysis types on ${url}`,
      });

      // Immediately navigate to the report page with polling
      navigate(`/reports/${analysisId}`);
      
    } catch (error) {
      setIsRunning(false);
      toast({
        title: "Analysis Failed",
        description: "Failed to start analysis. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Start Website Analysis
            </span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Enter a website URL and configure your analysis settings. Our AI will evaluate 
            consistency, detect exceptions, score satisfaction, and analyze efficiency.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Configuration Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* URL Input */}
            <Card className="bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="h-5 w-5 mr-2 text-primary" />
                  Website URL
                </CardTitle>
                <CardDescription>
                  Enter the URL you want to analyze
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="url">URL</Label>
                  <Input
                    id="url"
                    type="url"
                    placeholder="https://example.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className={`text-base ${url && !validateUrl(url) ? 'border-destructive' : ''}`}
                    aria-describedby="url-error"
                  />
                  {url && !validateUrl(url) && (
                    <p id="url-error" className="text-xs text-destructive">
                      Please enter a valid URL starting with http:// or https://
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Make sure the URL is publicly accessible and includes the protocol (https://)
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Device Selection */}
            <Card className="bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2 text-primary" />
                  Device & Settings
                </CardTitle>
                <CardDescription>
                  Choose the device type for simulation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="device">Device Type</Label>
                    <Select value={device} onValueChange={setDevice}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a device" />
                      </SelectTrigger>
                      <SelectContent>
                        {deviceOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center">
                              <option.icon className="h-4 w-4 mr-2" />
                              {option.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Analysis Types */}
            <Card className="bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle>Analysis Types</CardTitle>
                <CardDescription>
                  Select which analysis types to run
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analysisTypes.map((analysis) => (
                    <div key={analysis.key} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
                      <Checkbox
                        id={analysis.key}
                        checked={analyses[analysis.key as keyof typeof analyses]}
                        onCheckedChange={() => handleAnalysisToggle(analysis.key)}
                        className="mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <analysis.icon className="h-4 w-4 mr-2 text-primary" />
                            <Label htmlFor={analysis.key} className="font-medium cursor-pointer">
                              {analysis.title}
                            </Label>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            {analysis.estimated}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {analysis.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Summary & Action */}
          <div className="space-y-6">
            <Card className="bg-gradient-card shadow-card sticky top-6">
              <CardHeader>
                <CardTitle>Analysis Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>URL:</span>
                    <span className="text-muted-foreground truncate ml-2">
                      {url || "Not set"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Device:</span>
                    <span className="text-muted-foreground">
                      {device ? deviceOptions.find(d => d.value === device)?.label : "Not selected"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Analysis Types:</span>
                    <span className="text-muted-foreground">
                      {Object.values(analyses).filter(Boolean).length} selected
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-medium">
                    <span>Estimated Time:</span>
                    <span className="text-primary">
                      ~{(getEstimatedTime() / 1000).toFixed(1)}s
                    </span>
                  </div>
                </div>

                <Button 
                  onClick={handleStartAnalysis}
                  disabled={isRunning || !url || !device}
                  className="w-full bg-gradient-primary hover:shadow-glow"
                  size="lg"
                >
                  {isRunning ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Running Analysis...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Start Analysis
                    </>
                  )}
                </Button>

                {Object.values(analyses).filter(Boolean).length === 0 && (
                  <p className="text-xs text-muted-foreground text-center">
                    Select at least one analysis type to continue
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Popular URLs */}
            <Card className="bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle className="text-base">Popular Targets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    "https://tiktok.com",
                    "https://instagram.com", 
                    "https://twitter.com",
                    "https://youtube.com"
                  ].map((popularUrl) => (
                    <Button
                      key={popularUrl}
                      variant="ghost"
                      size="sm"
                      onClick={() => setUrl(popularUrl)}
                      className="w-full justify-start text-xs"
                    >
                      {popularUrl}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StartAnalysis;