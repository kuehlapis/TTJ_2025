import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SeverityBadge } from "@/components/SeverityBadge";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { api, AnalysisResult, ComplianceResult, ApiError } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Search, Filter, Download, RotateCcw, AlertTriangle } from "lucide-react";

// Import the geo-bot icon
import geoBotIcon from "/public/geo-bot-icon (1).png";

const Index = () => {
  const [prompt, setPrompt] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null); // Clear previous results before new analysis
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!prompt.trim()) return;
    
    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null); // Clear previous results before new analysis
    // Clear summery.csv before running analysis
    try {
      await fetch('http://127.0.0.1:8000/clear-summary', { method: 'POST' });
    } catch (e) {
      // Optionally handle error, but continue with analysis
    }
    try {
      // Always fetch fresh data, avoid cache
      const result = await api.analyze(prompt);
      setAnalysisResult(result);
      toast({
        title: "Analysis Complete",
        description: "Geo-compliance analysis has been completed successfully."
      });
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: errorMessage
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
      setPrompt("");
      setAnalysisResult(null);
      setError(null);
      // Add any additional state resets here if needed
  };

  const handleDownloadJSON = async () => {
    try {
      const data = await api.getResult();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'compliance-results.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Download Complete",
        description: "JSON results have been downloaded successfully."
      });
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : "Download failed";
      toast({
        variant: "destructive",
        title: "Download Failed",
        description: errorMessage
      });
    }
  };

  const handleDownloadCSV = async () => {
    try {
      const blob = await api.getSummaryCSV();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'compliance-summary.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Download Complete",
        description: "CSV summary has been downloaded successfully."
      });
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : "Download failed";
      toast({
        variant: "destructive",
        title: "Download Failed",
        description: errorMessage
      });
    }
  };

  const isPromptValid = prompt.trim().length > 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center space-x-3">
            <img src={geoBotIcon} alt="Geo Bot" className="h-8 w-8" />
            <h1 className="text-3xl font-bold text-foreground">
              Geo-Compliance Auto-Screen
            </h1>
            <Badge variant="secondary" className="text-xs">Demo</Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Input Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-primary" />
              <span>Feature Prompt Analysis</span>
            </CardTitle>
            <CardDescription>
              Enter a feature description to analyze for geo-compliance issues and legal requirements.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Textarea
                placeholder="Describe the feature you want to analyze for compliance issues..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[120px] resize-none"
                disabled={isAnalyzing}
              />
              <div className="text-xs text-muted-foreground text-right">
                {prompt.length} characters
              </div>
            </div>
            
            <Button 
              onClick={handleAnalyze}
              disabled={!isPromptValid || isAnalyzing}
              className="w-full transition-all duration-200 hover:bg-primary-hover"
              size="lg"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Analyzing...
                </>
              ) : (
                "Analyze Compliance"
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <Alert variant="destructive" className="mb-8">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {isAnalyzing && <LoadingSkeleton />}

        {/* Results Section */}
        {analysisResult && !isAnalyzing && (
          <div className="space-y-6 animate-fade-in">
            {/* Geolocation Chip */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-muted-foreground">Detected Location:</span>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                {analysisResult.data.geolocation}
              </Badge>
            </div>

            {/* Analysis Results Card */}
            <Card className="border-l-4 border-l-primary">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-xl">{analysisResult.data.law}</CardTitle>
                    <SeverityBadge severity={analysisResult.data.severity} />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground">Analysis Reasoning</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {analysisResult.data.reasoning}
                  </p>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground">Potential Violations</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {analysisResult.data.potential_violations}
                  </p>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground">Recommendations</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {analysisResult.data.recommendations}
                  </p>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground">Legal References</h4>
                  <p className="text-sm text-muted-foreground font-mono bg-muted/50 p-3 rounded">
                    {analysisResult.data.legal_references}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Search and Filter (Visual Only) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search results..." 
                  className="pl-9" 
                  disabled
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Filter by severity..." 
                  className="pl-9" 
                  disabled
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                onClick={handleReset}
                variant="outline" 
                className="flex-1"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Try Another Prompt
              </Button>
              
              <div className="flex gap-2 flex-1">
                <Button 
                  onClick={handleDownloadJSON}
                  variant="secondary"
                  className="flex-1"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download JSON
                </Button>
                <Button 
                  onClick={handleDownloadCSV}
                  variant="secondary"
                  className="flex-1"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download CSV
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
