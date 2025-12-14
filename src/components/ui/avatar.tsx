import { cn, getInitials } from "@/lib/utils";
import Image from "next/image";

export interface AvatarProps {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizes = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-lg",
};

const imageSizes = {
  sm: 32,
  md: 40,
  lg: 48,
  xl: 64,
};

export function Avatar({ src, alt, name, size = "md", className }: AvatarProps) {
  const initials = name ? getInitials(name) : "?";

  if (src) {
    return (
      <div className={cn("relative overflow-hidden rounded-full", sizes[size], className)}>
        <Image
          src={src}
          alt={alt || name || "Avatar"}
          width={imageSizes[size]}
          height={imageSizes[size]}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 font-medium text-white",
        sizes[size],
        className
      )}
    >
      {initials}
    </div>
  );
}
