import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface ScoreCardProps {
  title: string;
  score: number;
  description?: string;
  trend?: "up" | "down" | "stable";
  className?: string;
}

export const ScoreCard = ({ title, score, description, trend, className }: ScoreCardProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-success";
    if (score >= 70) return "text-warning";
    return "text-destructive";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return "success";
    if (score >= 70) return "warning";
    return "destructive";
  };

  return (
    <Card className={`bg-gradient-card shadow-card hover:shadow-elevated transition-all duration-300 ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Badge variant={getScoreBadge(score) as "default" | "secondary" | "destructive" | "outline"}>
          {score}/100
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className={`text-2xl font-bold ${getScoreColor(score)}`}>
            {score}%
          </div>
          <Progress value={score} className="h-2" />
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};