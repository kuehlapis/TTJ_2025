import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { GeoChip } from "@/components/GeoChip";
import { SummaryBar } from "@/components/SummaryBar";
import { FindingsTable } from "@/components/FindingsTable";
import { AnalysisResult, ReviewStatus } from "@/types/compliance";
import { analyzeFeature, exportToCsv, exportToJson } from "@/utils/api";
import { EXAMPLE_PROMPTS } from "@/data/mockData";
import { Download, AlertCircle, RefreshCw, FileText, FileJson } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [inputText, setInputText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reviewStates, setReviewStates] = useState<Record<string, ReviewStatus>>({});
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const characterCount = inputText.length;
  const maxCharacters = 2000;
  const isInputValid = inputText.trim().length > 0;

  const handleAnalyze = async () => {
    if (!isInputValid) return;

    setIsAnalyzing(true);
    setError(null);
    
    try {
      // Call analyzeFeature which now uses /api/analyze
      const result = await analyzeFeature({ raw_text: inputText });
      setAnalysisResult(result);

      // Initialize review states to "Confirm" for all findings
      const initialReviewStates: Record<string, ReviewStatus> = {};
      result.findings.forEach(finding => {
        initialReviewStates[finding.id] = "Confirm";
      });
      setReviewStates(initialReviewStates);

      toast({
        title: "Analysis Complete",
        description: `Found ${result.findings.length} compliance findings across ${result.detected_geos.length} jurisdictions.`,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed. Please try again.");
      toast({
        title: "Analysis Failed",
        description: err instanceof Error ? err.message : "There was an error analyzing your feature. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRetry = () => {
    handleAnalyze();
  };

  const handleReviewChange = (findingId: string, review: ReviewStatus) => {
    setReviewStates(prev => ({
      ...prev,
      [findingId]: review
    }));
  };

  const handleExport = async (format: 'csv' | 'json') => {
    if (!analysisResult) return;

    setIsExporting(true);
    try {
      let content: string;
      let filename: string;
      let mimeType: string;

      if (format === 'csv') {
        content = await exportToCsv(analysisResult.feature_id);
        filename = `compliance-analysis-${analysisResult.feature_id}.csv`;
        mimeType = 'text/csv';
      } else {
        content = await exportToJson(analysisResult.feature_id);
        filename = `compliance-analysis-${analysisResult.feature_id}.json`;
        mimeType = 'application/json';
      }

      // Create download
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Export Complete",
        description: `Downloaded ${filename}`,
      });
    } catch (err) {
      toast({
        title: "Export Failed",
        description: "There was an error exporting the results.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleExampleClick = (example: string) => {
    setInputText(example);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
            Geo-Compliance Auto-Screen
          </h1>
          <p className="text-lg text-muted-foreground">
            Automated jurisdiction compliance analysis for digital features
          </p>
          <Badge variant="secondary" className="mt-2">
            Demo Version
          </Badge>
        </div>

        {/* Input Section */}
        <Card className="mb-8 shadow-medium">
          <CardHeader>
            <CardTitle className="text-xl">Feature Description</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Textarea
                placeholder="Describe your feature in detail (e.g., 'A social media platform where users can create profiles, post content, and interact with friends through messaging and comments.')"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="min-h-[120px] resize-none"
                maxLength={maxCharacters}
              />
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>{characterCount}/{maxCharacters} characters</span>
                {characterCount > maxCharacters * 0.9 && (
                  <span className="text-needs-controls">Approaching limit</span>
                )}
              </div>
            </div>

            {!analysisResult && !isAnalyzing && (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">Try these examples:</p>
                <div className="flex flex-wrap gap-2">
                  {EXAMPLE_PROMPTS.map((example, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleExampleClick(example)}
                      className="text-left h-auto py-2 px-3"
                    >
                      <span className="line-clamp-2 text-xs">{example}</span>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                onClick={handleAnalyze}
                disabled={!isInputValid || isAnalyzing}
                className="flex items-center gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <LoadingSpinner size="sm" />
                    Analyzing...
                  </>
                ) : (
                  "Analyze Feature"
                )}
              </Button>

              {analysisResult && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleExport('csv')}
                    disabled={isExporting}
                    className="flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    Export CSV
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleExport('json')}
                    disabled={isExporting}
                    className="flex items-center gap-2"
                  >
                    <FileJson className="h-4 w-4" />
                    Export JSON
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Error State */}
        {error && (
          <Alert className="mb-6 border-destructive/50 bg-destructive/10">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>{error}</span>
              <Button variant="outline" size="sm" onClick={handleRetry}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {isAnalyzing && (
          <Card className="mb-6">
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center space-y-4">
                <LoadingSpinner size="lg" />
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Analyzing Feature</h3>
                  <p className="text-sm text-muted-foreground">
                    Detecting jurisdictions and evaluating compliance requirements...
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results Section */}
        {analysisResult && (
          <div className="space-y-6">
            {/* Detected Jurisdictions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Detected Jurisdictions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.detected_geos.map((geo) => (
                    <GeoChip key={geo} geo={geo} />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Summary Bar */}
            <SummaryBar summary={analysisResult.summary} />

            {/* Findings Table */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Compliance Findings</CardTitle>
              </CardHeader>
              <CardContent>
                <FindingsTable
                  findings={analysisResult.findings.map(finding => ({
                    ...finding,
                    review: reviewStates[finding.id] || "Confirm"
                  }))}
                  onReviewChange={handleReviewChange}
                />
              </CardContent>
            </Card>

            {/* Footer with latency */}
            <div className="text-center text-sm text-muted-foreground">
              {analysisResult.latency_ms ? (
                <span>Analysis completed in {analysisResult.latency_ms}ms</span>
              ) : (
                <span>Analysis latency: N/A</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
