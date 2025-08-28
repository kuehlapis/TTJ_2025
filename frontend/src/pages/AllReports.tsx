import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, ExternalLink, TrendingUp, AlertCircle, Search, Filter } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const mockHistoryData = [
  {
    id: "run_2024_001",
    url: "https://tiktok.com/foryou",
    device: "iPhone 14 Pro",
    timestamp: "2024-01-15T10:30:00Z",
    duration: 3420,
    scores: { consistency: 87, satisfaction: 92, efficiency: 78 },
    status: "completed"
  },
  {
    id: "run_2024_002", 
    url: "https://instagram.com/feed",
    device: "Samsung Galaxy S23",
    timestamp: "2024-01-14T15:45:00Z",
    duration: 2890,
    scores: { consistency: 94, satisfaction: 88, efficiency: 85 },
    status: "completed"
  },
  {
    id: "run_2024_003",
    url: "https://twitter.com/home",
    device: "iPad Pro",
    timestamp: "2024-01-14T09:15:00Z",
    duration: 4100,
    scores: { consistency: 76, satisfaction: 82, efficiency: 72 },
    status: "completed"
  },
  {
    id: "run_2024_004",
    url: "https://youtube.com/shorts",
    device: "iPhone 15",
    timestamp: "2024-01-13T14:20:00Z",
    duration: 5200,
    scores: { consistency: 89, satisfaction: 90, efficiency: 65 },
    status: "failed"
  }
];

const AllReports = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-success";
    if (score >= 70) return "text-warning"; 
    return "text-destructive";
  };

  const getOverallScore = (scores: { consistency: number; satisfaction: number; efficiency: number }) => {
    return Math.round((scores.consistency + scores.satisfaction + scores.efficiency) / 3);
  };

  const filteredData = mockHistoryData.filter((run) => {
    const matchesSearch = run.url.toLowerCase().includes(searchTerm.toLowerCase());
    const overallScore = getOverallScore(run.scores);
    
    if (activeFilter === "good" && overallScore < 80) return false;
    if (activeFilter === "bad" && overallScore >= 80) return false;
    
    return matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed": return <Badge variant="secondary">Completed</Badge>;
      case "failed": return <Badge variant="destructive">Failed</Badge>;
      case "running": return <Badge variant="default">Running</Badge>;
      default: return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">All Reports</h1>
          <p className="text-muted-foreground">
            View and manage your website analysis reports
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-card shadow-card">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">24</div>
              <div className="text-sm text-muted-foreground">Total Runs</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-card shadow-card">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-success">87%</div>
              <div className="text-sm text-muted-foreground">Avg Consistency</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-card shadow-card">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-warning">3.2s</div>
              <div className="text-sm text-muted-foreground">Avg Duration</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-card shadow-card">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-accent">95%</div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search analyzed websites..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Tabs value={activeFilter} onValueChange={setActiveFilter}>
            <TabsList>
              <TabsTrigger value="all">All Results</TabsTrigger>
              <TabsTrigger value="good">Good Performance (80%+)</TabsTrigger>
              <TabsTrigger value="bad">Needs Improvement (&lt;80%)</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* History List */}
        <div className="space-y-4">
          {filteredData.map((run) => (
            <Card key={run.id} className="bg-gradient-card shadow-card hover:shadow-elevated transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div>
                      <CardTitle className="text-lg">{run.url}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <Clock className="h-3 w-3" />
                        {new Date(run.timestamp).toLocaleString()}
                        <span>•</span>
                        <span>{run.device}</span>
                        <span>•</span>
                        <span>{run.duration}ms</span>
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(run.status)}
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/reports/${run.id}`}>
                        <ExternalLink className="h-3 w-3 mr-1" />
                        View Report
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 rounded-lg bg-muted/20">
                    <div className={`text-xl font-bold ${getScoreColor(run.scores.consistency)}`}>
                      {run.scores.consistency}%
                    </div>
                    <div className="text-xs text-muted-foreground">Consistency</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/20">
                    <div className={`text-xl font-bold ${getScoreColor(run.scores.satisfaction)}`}>
                      {run.scores.satisfaction}%
                    </div>
                    <div className="text-xs text-muted-foreground">Satisfaction</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/20">
                    <div className={`text-xl font-bold ${getScoreColor(run.scores.efficiency)}`}>
                      {run.scores.efficiency}%
                    </div>
                    <div className="text-xs text-muted-foreground">Efficiency</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            ))}
        </div>

        {filteredData.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No results found matching your criteria.</p>
          </div>
        )}

        {/* Load More */}
        {filteredData.length > 0 && (
          <div className="text-center mt-8">
            <Button variant="outline">
              Load More Results
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AllReports;