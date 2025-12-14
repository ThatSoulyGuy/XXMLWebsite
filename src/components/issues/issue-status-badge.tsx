import { Badge } from "@/components/ui/badge";
import { Circle, CheckCircle, Clock, XCircle } from "lucide-react";

interface IssueStatusBadgeProps {
  status: string;
}

const statusConfig: Record<string, { label: string; variant: "success" | "warning" | "default" | "destructive"; Icon: typeof Circle }> = {
  OPEN: { label: "Open", variant: "success", Icon: Circle },
  IN_PROGRESS: { label: "In Progress", variant: "warning", Icon: Clock },
  CLOSED: { label: "Closed", variant: "default", Icon: CheckCircle },
  WONT_FIX: { label: "Won't Fix", variant: "destructive", Icon: XCircle },
};

export function IssueStatusBadge({ status }: IssueStatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.OPEN;
  const { label, variant, Icon } = config;

  return (
    <Badge variant={variant} className="gap-1">
      <Icon className="h-3 w-3" />
      {label}
    </Badge>
  );
}
