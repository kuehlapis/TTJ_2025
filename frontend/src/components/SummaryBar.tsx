import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SummaryBarProps {
  summary: {
    HIGH: number;
    MED: number;
    OK: number;
  };
  className?: string;
}

export function SummaryBar({ summary, className }: SummaryBarProps) {
  const total = summary.HIGH + summary.MED + summary.OK;

  return (
    <Card className={cn("w-full", className)}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="text-sm font-medium text-muted-foreground">
            Risk Summary ({total} findings)
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-severity-high"></div>
              <span className="text-sm font-medium">HIGH</span>
              <span className="text-lg font-bold text-severity-high">{summary.HIGH}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-severity-medium"></div>
              <span className="text-sm font-medium">MED</span>
              <span className="text-lg font-bold text-severity-medium">{summary.MED}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-severity-ok"></div>
              <span className="text-sm font-medium">OK</span>
              <span className="text-lg font-bold text-severity-ok">{summary.OK}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}