import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Zap, Eye, AlertTriangle, TrendingUp, FileSearch } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Intelligent UI Feedback
            </span>
            <br />
            <span className="text-foreground">Using LLMs</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Go beyond traditional GUI automation with AI-powered analysis for consistency verification, 
            exception detection, and efficiency optimization across dynamic web interfaces.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg" className="bg-gradient-primary hover:shadow-glow">
              <Link to="/reports/demo-run-001">
                View Demo Report
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/start">
                <FileSearch className="mr-2 h-4 w-4" />
                Start Analysis
              </Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-gradient-card shadow-card hover:shadow-elevated transition-all duration-300">
            <CardHeader>
              <Eye className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Consistency Verification</CardTitle>
              <CardDescription>
                Compare visual screenshots with DOM structure to detect mismatches and suggest fixes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Screenshot vs DOM comparison</li>
                <li>• Visual hierarchy validation</li>
                <li>• Brand consistency checks</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-card hover:shadow-elevated transition-all duration-300">
            <CardHeader>
              <AlertTriangle className="h-8 w-8 text-warning mb-2" />
              <CardTitle>Exception Detection</CardTitle>
              <CardDescription>
                Identify popups, crashes, overlaps, and anomalies with intelligent severity assessment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Modal and popup detection</li>
                <li>• Error state identification</li>
                <li>• Accessibility violations</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-card hover:shadow-elevated transition-all duration-300">
            <CardHeader>
              <Zap className="h-8 w-8 text-accent mb-2" />
              <CardTitle>Efficiency Analysis</CardTitle>
              <CardDescription>
                Optimize analysis speed with caching, cropping, and lightweight model suggestions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Performance bottleneck detection</li>
                <li>• Caching optimization</li>
                <li>• Model efficiency tuning</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Demo Section */}
        <Card className="bg-gradient-card shadow-elevated">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  TikTok Demo Analysis
                </CardTitle>
                <CardDescription>
                  Live example of UI feedback analysis on social media interface
                </CardDescription>
              </div>
              <Badge variant="secondary">Latest Run</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold">Analysis Results</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 rounded-lg bg-muted/20">
                    <div className="text-2xl font-bold text-success">92%</div>
                    <div className="text-sm text-muted-foreground">Satisfaction</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/20">
                    <div className="text-2xl font-bold text-warning">87%</div>
                    <div className="text-sm text-muted-foreground">Consistency</div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Strong visual hierarchy with excellent thumb-friendly design. 
                  Minor button consistency issues identified with actionable fixes.
                </p>
              </div>
              <div className="flex items-center justify-center">
                <Button asChild className="bg-gradient-primary hover:shadow-glow">
                  <Link to="/reports/demo-run-001">
                    View Full Report
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Home;