import { cn } from "@/lib/utils";

export interface BadgeProps {
  variant?: "default" | "primary" | "success" | "warning" | "destructive" | "purple";
  className?: string;
  children: React.ReactNode;
  color?: string;
}

const variantStyles = {
  default: "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200",
  primary: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  success: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  destructive: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  purple: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
};

export function Badge({ variant = "default", className, color, children }: BadgeProps) {
  const style = color
    ? { backgroundColor: `${color}20`, color, borderColor: `${color}40` }
    : undefined;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-transparent px-2.5 py-0.5 text-xs font-medium",
        !color && variantStyles[variant],
        color && "border",
        className
      )}
      style={style}
    >
      {children}
    </span>
  );
}
