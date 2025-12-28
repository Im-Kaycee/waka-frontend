import { Clock, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface RouteCardProps {
  duration: string;
  difficulty: string;
  description: string;
  isRecommended?: boolean;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export function RouteCard({
  duration,
  difficulty,
  description,
  isRecommended = false,
  onClick,
  className,
  style,
}: RouteCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full bg-card rounded-xl border-2 border-primary/30 p-4 text-left",
        "transition-all duration-200 shadow-card",
        "hover:shadow-card-hover hover:border-primary/50 hover:-translate-y-0.5",
        "active:scale-[0.99] active:shadow-card tap-highlight-none",
        "focus:outline-none focus:ring-2 focus:ring-primary/30",
        className
      )}
      style={style}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          {isRecommended && (
            <span className="inline-block bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full mb-2">
              Recommended
            </span>
          )}
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-primary" />
              <span className="font-medium text-foreground">{duration}</span>
            </div>
            <span className="font-medium text-foreground">{difficulty}</span>
          </div>
        </div>
        <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </button>
  );
}
