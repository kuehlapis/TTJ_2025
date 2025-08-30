import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SeverityBadgeProps {
  severity: 'High' | 'Medium' | 'Low';
  className?: string;
}

const severityConfig = {
  High: {
    className: "bg-severity-high text-severity-high-foreground hover:bg-severity-high/90",
    label: "High Risk"
  },
  Medium: {
    className: "bg-severity-medium text-severity-medium-foreground hover:bg-severity-medium/90",
    label: "Medium Risk"
  },
  Low: {
    className: "bg-severity-low text-severity-low-foreground hover:bg-severity-low/90",
    label: "Low Risk"
  }
};

export const SeverityBadge = ({ severity, className }: SeverityBadgeProps) => {
  const config = severityConfig[severity];
  
  return (
    <Badge className={cn(config.className, className)}>
      {config.label}
    </Badge>
  );
};