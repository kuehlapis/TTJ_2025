import { cn } from "@/lib/utils";

interface GeoChipProps {
  geo: string;
  className?: string;
}

export function GeoChip({ geo, className }: GeoChipProps) {
  return (
    <span className={cn(
      "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium",
      "bg-primary/10 text-primary border border-primary/20",
      className
    )}>
      {geo}
    </span>
  );
}