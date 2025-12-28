import { cn } from "@/lib/utils";

interface RouteIconProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function RouteIcon({ className, size = "md" }: RouteIconProps) {
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  };

  return (
    <div
      className={cn(
        "rounded-full border-4 border-destructive flex items-center justify-center",
        sizeClasses[size],
        className
      )}
    >
      <svg
        viewBox="0 0 64 64"
        className="w-3/5 h-3/5 text-destructive"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      >
        <circle cx="20" cy="16" r="6" />
        <circle cx="44" cy="48" r="6" />
        <path d="M20 22 C20 35, 44 30, 44 42" />
        <circle cx="20" cy="40" r="4" />
      </svg>
    </div>
  );
}
