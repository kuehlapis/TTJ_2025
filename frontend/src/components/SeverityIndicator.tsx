import { Severity } from "@/types/compliance";
import { cn } from "@/lib/utils";

interface SeverityIndicatorProps {
  severity: Severity;
  className?: string;
}

export function SeverityIndicator({ severity, className }: SeverityIndicatorProps) {
  const getVariantClasses = () => {
    switch (severity) {
      case "HIGH":
        return "severity-indicator high";
      case "MED":
        return "severity-indicator medium";
      case "OK":
        return "severity-indicator ok";
      default:
        return "severity-indicator";
    }
  };

  return (
    <span className={cn(getVariantClasses(), className)}>
      {severity}
    </span>
  );
}