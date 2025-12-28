import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center px-6 py-12 text-center", className)}>
      {icon && (
        <div className="mb-6 animate-fade-in">
          {icon}
        </div>
      )}
      <h2 className="text-xl font-semibold text-foreground mb-2 animate-fade-in" style={{ animationDelay: "0.1s" }}>
        {title}
      </h2>
      {description && (
        <p className="text-muted-foreground mb-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          className="animate-fade-in"
          style={{ animationDelay: "0.3s" }}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
