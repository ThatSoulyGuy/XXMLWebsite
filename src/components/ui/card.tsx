import { cn } from "@/lib/utils";

interface CardProps {
  className?: string;
  children: React.ReactNode;
}

export function Card({ className, children }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-slate-200 bg-white/80 shadow-sm backdrop-blur-sm transition-all hover:border-cyan-500/30 hover:shadow-[0_0_20px_rgba(0,212,255,0.1)] dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-cyan-500/30",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children }: CardProps) {
  return <div className={cn("border-b border-slate-200 px-6 py-4 dark:border-slate-700/50", className)}>{children}</div>;
}

export function CardTitle({ className, children }: CardProps) {
  return <h3 className={cn("text-lg font-bold text-slate-900 dark:text-white", className)}>{children}</h3>;
}

export function CardDescription({ className, children }: CardProps) {
  return <p className={cn("text-sm text-slate-500 dark:text-slate-400", className)}>{children}</p>;
}

export function CardContent({ className, children }: CardProps) {
  return <div className={cn("px-6 py-4", className)}>{children}</div>;
}

export function CardFooter({ className, children }: CardProps) {
  return (
    <div className={cn("border-t border-slate-200 px-6 py-4 dark:border-slate-700/50", className)}>{children}</div>
  );
}
