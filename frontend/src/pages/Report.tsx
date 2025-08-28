import { Layout } from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScoreCard } from "@/components/ScoreCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { mockAnalysisData } from "@/data/mockData";
import tiktokMockup from "@/assets/tiktok-mockup.jpg";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Image as ImageIcon,
  FileText,
  Database,
  Zap,
  TrendingUp,
  AlertTriangle,
  Download,
  FileSpreadsheet,
  X,
  RotateCcw,
  RefreshCw
} from "lucide-react";
import * as XLSX from 'xlsx';

type AnalysisStatus = 'queued' | 'running' | 'completed' | 'failed';

interface AnalysisState {
  status: AnalysisStatus;
  url: string;
  device: string;
  progress?: number;
  data?: any;
  error?: string;
}

const Report = () => {
  const { analysisId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [analysisState, setAnalysisState] = useState<AnalysisState>({
    status: 'queued',
    url: '',
    device: ''
  });
  
  const [retryCount, setRetryCount] = useState(0);
  const [pollingInterval, setPollingInterval] = useState(2000);

  // Mock data for demo purposes
  const data = mockAnalysisData;

  // Simulate polling for analysis status
  useEffect(() => {
    if (!analysisId) return;

    const pollAnalysis = async () => {
      try {
        // Simulate API call to GET /analyses/:analysisId
        console.log(`Polling analysis ${analysisId}`);
        
        // Simulate different states based on time
        const now = Date.now();
        const startTime = parseInt(analysisId.split('_')[1] || '0');
        const elapsed = now - startTime;
        
        if (elapsed < 3000) {
          setAnalysisState(prev => ({
            ...prev,
            status: 'queued',
            url: 'https://tiktok.com',
            device: 'iPhone 14 Pro'
          }));
        } else if (elapsed < 8000) {
          setAnalysisState(prev => ({
            ...prev,
            status: 'running',
            progress: Math.min(90, Math.floor((elapsed - 3000) / 50))
          }));
        } else {
          setAnalysisState(prev => ({
            ...prev,
            status: 'completed',
            progress: 100,
            data: mockAnalysisData
          }));
          return; // Stop polling
        }
        
        setRetryCount(0);
        setPollingInterval(2000);
      } catch (error) {
        console.error('Polling error:', error);
        
        if (retryCount < 3) {
          setRetryCount(prev => prev + 1);
          setPollingInterval(prev => Math.min(prev * 2, 8000)); // Exponential backoff
        } else {
          setAnalysisState(prev => ({
            ...prev,
            status: 'failed',
            error: 'Failed to fetch analysis status'
          }));
          return;
        }
      }
    };

    // Initial poll
    pollAnalysis();

    // Set up polling interval
    const interval = setInterval(pollAnalysis, pollingInterval);

    return () => clearInterval(interval);
  }, [analysisId, retryCount, pollingInterval]);

  const handleRerun = () => {
    navigate('/start');
  };

  const handleRefresh = () => {
    setRetryCount(0);
    setPollingInterval(2000);
    setAnalysisState(prev => ({ ...prev, status: 'queued', error: undefined }));
  };

  const getStatusBadge = (status: AnalysisStatus) => {
    const variants = {
      queued: { variant: "secondary" as const, text: "Queued", icon: Clock },
      running: { variant: "default" as const, text: "Running", icon: RefreshCw },
      completed: { variant: "secondary" as const, text: "Completed", icon: CheckCircle2 },
      failed: { variant: "destructive" as const, text: "Failed", icon: AlertCircle }
    };
    
    const { variant, text, icon: Icon } = variants[status];
    
    return (
      <Badge variant={variant} className="text-sm">
        <Icon className={`h-3 w-3 mr-1 ${status === 'running' ? 'animate-spin' : ''}`} />
        {text}
      </Badge>
    );
  };

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      data.test_results.test_cases.map(testCase => ({
        'UAT ID': testCase.id,
        'Test Scenario': testCase.test_name,
        'User Story': testCase.user_story || 'N/A',
        'Description': testCase.description,
        'Expected Result': testCase.expected_result,
        'Actual Result': testCase.actual_result,
        'Status': testCase.status.toUpperCase(),
        'Severity': testCase.severity.toUpperCase(),
        'Element Tested': testCase.selector
      }))
    );
    
    // Add summary sheet
    const summaryData = [
      ['UAT Phase', data.test_results.summary.uat_phase],
      ['Test Environment', data.test_results.summary.test_environment],
      ['Total Test Cases', data.test_results.summary.total_tests],
      ['Passed', data.test_results.summary.passed],
      ['Failed', data.test_results.summary.failed],
      ['Pass Rate', `${data.test_results.summary.pass_rate}%`],
      ['Critical Failures', data.test_results.summary.critical_failures]
    ];
    
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'UAT Summary');
    XLSX.utils.book_append_sheet(workbook, worksheet, 'UAT Test Cases');
    
    XLSX.writeFile(workbook, `UAT-Results-${data.run_data.run_id}.xlsx`);
  };

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Analysis Report</h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                {analysisId && <span>ID: {analysisId}</span>}
                {analysisId && analysisState.url && <span>•</span>}
                {analysisState.url && <span>URL: {analysisState.url}</span>}
                {analysisState.url && analysisState.device && <span>•</span>}
                {analysisState.device && <span>Device: {analysisState.device}</span>}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {getStatusBadge(analysisState.status)}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRerun}
                className="hidden sm:flex"
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                Re-run
              </Button>
              {analysisState.status === 'failed' && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRefresh}
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Retry
                </Button>
              )}
            </div>
          </div>
          
          {/* Progress bar for running state */}
          {analysisState.status === 'running' && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                <span>Analysis in progress...</span>
                <span>{analysisState.progress || 0}%</span>
              </div>
              <Progress value={analysisState.progress || 0} className="w-full" />
            </div>
          )}
          
          {/* Error state */}
          {analysisState.status === 'failed' && (
            <Card className="mt-4 border-destructive">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <span className="font-medium">Analysis Failed</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {analysisState.error || 'An error occurred while processing the analysis.'}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Show content only when analysis is completed */}
        {analysisState.status === 'completed' && (
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7" role="tablist">
            <TabsTrigger value="overview" role="tab" aria-selected="true">Overview</TabsTrigger>
            <TabsTrigger value="consistency" role="tab">Consistency</TabsTrigger>
            <TabsTrigger value="exceptions" role="tab">Exceptions</TabsTrigger>
            <TabsTrigger value="satisfaction" role="tab">Satisfaction</TabsTrigger>
            <TabsTrigger value="efficiency" role="tab">Efficiency</TabsTrigger>
            <TabsTrigger value="test-results" role="tab">Test Results</TabsTrigger>
            <TabsTrigger value="artifacts" role="tab">Artifacts</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card className="bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle>Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">{data.overview.summary}</p>
                
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <ScoreCard 
                    title="Consistency Score"
                    score={data.overview.scores.consistency}
                    description="Visual-DOM alignment"
                  />
                  <ScoreCard 
                    title="Satisfaction Score"
                    score={data.overview.scores.satisfaction}
                    description="UX quality metrics"
                  />
                  <ScoreCard 
                    title="Efficiency Health"
                    score={data.overview.scores.efficiency_health}
                    description="Performance optimization"
                  />
                </div>

                <div>
                  <h4 className="font-semibold mb-3 flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2 text-warning" />
                    Top Issues
                  </h4>
                  <div className="space-y-2">
                    {data.overview.top_issues.map((issue, index) => (
                      <div key={index} className="flex items-start gap-2 p-3 rounded-lg bg-muted/20">
                        <AlertCircle className="h-4 w-4 mt-0.5 text-warning" />
                        <span className="text-sm">{issue}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="consistency" className="space-y-6">
            <div className="grid gap-6">
              <ScoreCard 
                title="Overall Consistency Score"
                score={data.consistency.score}
                description="Comparison between visual appearance and DOM structure"
              />
              
              <Card className="bg-gradient-card shadow-card">
                <CardHeader>
                  <CardTitle>Detected Mismatches</CardTitle>
                  <CardDescription>
                    Issues where visual presentation differs from underlying structure
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {data.consistency.mismatches.map((mismatch, index) => (
                      <div key={index} className="border rounded-lg p-4 bg-muted/10">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline">{mismatch.kind}</Badge>
                          <span className="text-xs text-muted-foreground">
                            {mismatch.screenshot_region}
                          </span>
                        </div>
                        <h4 className="font-medium mb-2">{mismatch.detail}</h4>
                        <div className="text-sm text-muted-foreground">
                          <div><strong>Selector:</strong> {mismatch.dom_selector}</div>
                          <div className="mt-1">
                            <strong>DOM:</strong> {mismatch.evidence.dom_text} | 
                            <strong> Visual:</strong> {mismatch.evidence.visual_text}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="exceptions" className="space-y-6">
            <Card className="bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-warning" />
                  Exception Detection Results
                </CardTitle>
                <CardDescription>
                  Identified anomalies and suggested handling approaches
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant={data.exceptions.detected ? "destructive" : "secondary"}>
                      {data.exceptions.detected ? "Exceptions Found" : "No Exceptions"}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      Types: {data.exceptions.types.join(", ")}
                    </span>
                  </div>
                  
                  {data.exceptions.details.map((exception, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-muted/10">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline">{exception.kind}</Badge>
                        <Badge variant={
                          exception.severity === "low" ? "secondary" : 
                          exception.severity === "medium" ? "default" : "destructive"
                        }>
                          {exception.severity}
                        </Badge>
                      </div>
                      <div className="text-sm">
                        <div className="mb-2"><strong>Element:</strong> {exception.selector}</div>
                        <div className="text-muted-foreground">{exception.suggestion}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="satisfaction" className="space-y-6">
            <ScoreCard 
              title="Overall Satisfaction Score"
              score={data.satisfaction.score}
              description="User experience quality based on design principles"
            />
            
            <Card className="bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle>UX Rubric Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(data.satisfaction.rubric).map(([key, score]) => (
                    <div key={key} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="capitalize text-sm font-medium">
                          {key.replace(/_/g, " ")}
                        </span>
                        <span className="text-sm text-muted-foreground">{score}/100</span>
                      </div>
                      <Progress value={score} className="h-2" />
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 rounded-lg bg-muted/20">
                  <p className="text-sm text-muted-foreground">{data.satisfaction.comments}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="efficiency" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-gradient-card shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="h-5 w-5 mr-2 text-accent" />
                    Performance Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-2xl font-bold text-accent mb-4">
                      {data.efficiency.total_ms}ms total
                    </div>
                    {Object.entries(data.efficiency.breakdown_ms).map(([phase, time]) => (
                      <div key={phase} className="flex justify-between items-center">
                        <span className="capitalize text-sm">{phase.replace(/_/g, " ")}</span>
                        <Badge variant="outline">{time}ms</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card shadow-card">
                <CardHeader>
                  <CardTitle>Cache Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-4">
                    <div className="text-2xl font-bold text-success">
                      {(data.efficiency.cache.hit_rate * 100).toFixed(0)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Cache Hit Rate</div>
                  </div>
                  <Progress value={data.efficiency.cache.hit_rate * 100} className="mb-4" />
                  <div className="space-y-1">
                    {data.efficiency.cache.suggestions.map((suggestion, index) => (
                      <div key={index} className="text-xs text-muted-foreground">
                        • {suggestion}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle>Optimization Suggestions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {data.efficiency.suggestions.map((suggestion, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/20">
                      <TrendingUp className="h-4 w-4 mt-0.5 text-accent" />
                      <span className="text-sm">{suggestion}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="test-results" className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">UAT Results Summary</h2>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                  <span>Phase: {data.test_results.summary.uat_phase}</span>
                  <span>•</span>
                  <span>Environment: {data.test_results.summary.test_environment}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>Total Tests: {data.test_results.summary.total_tests}</span>
                  <span>•</span>
                  <span className="text-success">Passed: {data.test_results.summary.passed}</span>
                  <span>•</span>
                  <span className="text-destructive">Failed: {data.test_results.summary.failed}</span>
                  <span>•</span>
                  <span>Pass Rate: {data.test_results.summary.pass_rate}%</span>
                  {data.test_results.summary.critical_failures > 0 && (
                    <>
                      <span>•</span>
                      <span className="text-destructive font-medium">Critical: {data.test_results.summary.critical_failures}</span>
                    </>
                  )}
                </div>
              </div>
              <Button onClick={downloadExcel} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download Excel
              </Button>
            </div>

            <Card className="bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileSpreadsheet className="h-5 w-5 mr-2" />
                  UAT Test Scenarios
                </CardTitle>
                <CardDescription>
                  User Acceptance Testing results with business requirement validation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.test_results.test_cases.map((testCase, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-muted/10">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{testCase.id}</Badge>
                          <Badge variant={
                            testCase.status === "pass" ? "secondary" : "destructive"
                          }>
                            {testCase.status === "pass" ? (
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                            ) : (
                              <X className="h-3 w-3 mr-1" />
                            )}
                            {testCase.status.toUpperCase()}
                          </Badge>
                          <Badge variant={
                            testCase.severity === "low" ? "secondary" : 
                            testCase.severity === "medium" ? "default" : "destructive"
                          }>
                            {testCase.severity}
                          </Badge>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {testCase.selector}
                        </span>
                      </div>
                      
                      <h4 className="font-medium mb-2">{testCase.test_name}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{testCase.description}</p>
                      {testCase.user_story && (
                        <div className="text-sm text-primary mb-3 p-2 bg-primary/5 rounded">
                          <strong>User Story:</strong> {testCase.user_story}
                        </div>
                      )}
                      
                      <div className="grid md:grid-cols-2 gap-3 text-sm">
                        <div className="p-3 rounded bg-muted/20">
                          <div className="font-medium text-success mb-1">Expected Result</div>
                          <div>{testCase.expected_result}</div>
                        </div>
                        <div className={`p-3 rounded ${
                          testCase.status === "pass" ? "bg-success/10" : "bg-destructive/10"
                        }`}>
                          <div className={`font-medium mb-1 ${
                            testCase.status === "pass" ? "text-success" : "text-destructive"
                          }`}>
                            Actual Result
                          </div>
                          <div>{testCase.actual_result}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="artifacts" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-gradient-card shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ImageIcon className="h-5 w-5 mr-2" />
                    Screenshot Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-[9/16] bg-muted rounded-lg overflow-hidden mb-4">
                    <img 
                      src={tiktokMockup} 
                      alt="TikTok UI Screenshot" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    View Full Screenshot
                  </Button>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card className="bg-gradient-card shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="h-5 w-5 mr-2" />
                      Extracted Markdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="text-xs bg-muted/20 p-3 rounded-lg overflow-auto max-h-48">
                      {data.artifacts_view.markdown_excerpt}
                    </pre>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-card shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Database className="h-5 w-5 mr-2" />
                      Metadata
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div><strong>Title:</strong> {data.artifacts_view.metadata_excerpt.title}</div>
                      <div><strong>H1:</strong> {data.artifacts_view.metadata_excerpt.dom_elements.h1}</div>
                      <div><strong>CTAs:</strong> {data.artifacts_view.metadata_excerpt.dom_elements.ctas.join(", ")}</div>
                      <div><strong>Links:</strong> {data.artifacts_view.metadata_excerpt.links.length} found</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        )}
        
        {/* Show message for non-completed states */}
        {analysisState.status !== 'completed' && analysisState.status !== 'failed' && (
          <Card className="mt-8">
            <CardContent className="pt-6 text-center">
              <div className="text-muted-foreground">
                {analysisState.status === 'queued' && 'Analysis is queued and will start shortly...'}
                {analysisState.status === 'running' && 'Analysis is in progress. Results will appear here when complete.'}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Report;