import { AlertCircle, AlertTriangle, Info, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

interface CalloutProps {
  type?: "info" | "tip" | "warning" | "danger";
  title?: string;
  children: React.ReactNode;
}

const calloutStyles = {
  info: {
    container: "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20",
    icon: "text-blue-600 dark:text-blue-400",
    title: "text-blue-900 dark:text-blue-200",
    content: "text-blue-800 dark:text-blue-300",
  },
  tip: {
    container: "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20",
    icon: "text-green-600 dark:text-green-400",
    title: "text-green-900 dark:text-green-200",
    content: "text-green-800 dark:text-green-300",
  },
  warning: {
    container: "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20",
    icon: "text-yellow-600 dark:text-yellow-400",
    title: "text-yellow-900 dark:text-yellow-200",
    content: "text-yellow-800 dark:text-yellow-300",
  },
  danger: {
    container: "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20",
    icon: "text-red-600 dark:text-red-400",
    title: "text-red-900 dark:text-red-200",
    content: "text-red-800 dark:text-red-300",
  },
};

const icons = {
  info: Info,
  tip: Lightbulb,
  warning: AlertTriangle,
  danger: AlertCircle,
};

const defaultTitles = {
  info: "Note",
  tip: "Tip",
  warning: "Warning",
  danger: "Danger",
};

export function Callout({ type = "info", title, children }: CalloutProps) {
  const styles = calloutStyles[type];
  const Icon = icons[type];
  const displayTitle = title || defaultTitles[type];

  return (
    <div
      className={cn(
        "my-6 rounded-lg border p-4",
        styles.container
      )}
    >
      <div className="flex gap-3">
        <Icon className={cn("mt-0.5 h-5 w-5 flex-shrink-0", styles.icon)} />
        <div className="flex-1">
          <p className={cn("font-semibold", styles.title)}>{displayTitle}</p>
          <div className={cn("mt-1 text-sm", styles.content)}>{children}</div>
        </div>
      </div>
    </div>
  );
}
