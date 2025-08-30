import { ComplianceLabel as ComplianceLabelType } from "@/types/compliance";
import { cn } from "@/lib/utils";

interface ComplianceLabelProps {
  label: ComplianceLabelType;
  className?: string;
}

export function ComplianceLabel({ label, className }: ComplianceLabelProps) {
  const getVariantClasses = () => {
    switch (label) {
      case "✅ Compliant":
        return "compliance-badge compliant";
      case "❌ Prohibited":
        return "compliance-badge prohibited";
      case "⚠️ Needs Controls":
        return "compliance-badge needs-controls";
      default:
        return "compliance-badge";
    }
  };

  return (
    <span className={cn(getVariantClasses(), className)}>
      {label}
    </span>
  );
}