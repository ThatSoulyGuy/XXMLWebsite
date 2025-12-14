import { Badge } from "@/components/ui/badge";

interface IssuePriorityBadgeProps {
  priority: string;
}

const priorityConfig: Record<string, { label: string; variant: "destructive" | "warning" | "default" | "primary" }> = {
  CRITICAL: { label: "Critical", variant: "destructive" },
  HIGH: { label: "High", variant: "warning" },
  MEDIUM: { label: "Medium", variant: "default" },
  LOW: { label: "Low", variant: "primary" },
};

export function IssuePriorityBadge({ priority }: IssuePriorityBadgeProps) {
  const config = priorityConfig[priority] || priorityConfig.MEDIUM;

  return <Badge variant={config.variant}>{config.label}</Badge>;
}
