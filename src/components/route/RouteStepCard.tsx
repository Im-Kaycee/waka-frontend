import { Car, Bike, Footprints, Bus, Train, MapPin, Building } from "lucide-react";
import { cn } from "@/lib/utils";

const transportIcons: Record<string, React.ElementType> = {
  cab: Car,
  taxi: Car,
  car: Car,
  bike: Bike,
  walk: Footprints,
  bus: Bus,
  train: Train,
};

interface RouteStepCardProps {
  transportMode: string;
  dropName: string;
  instruction: string;
  landmark: string;
  className?: string;
  style?: React.CSSProperties;
}

export function RouteStepCard({
  transportMode,
  dropName,
  instruction,
  landmark,
  className,
  style,
}: RouteStepCardProps) {
  const TransportIcon = transportIcons[transportMode.toLowerCase()] || Car;

  return (
    <div
      className={cn(
        "border-b border-border/50 last:border-b-0 py-4 first:pt-0 last:pb-0",
        className
      )}
      style={style}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <TransportIcon className="h-5 w-5 text-primary" />
          <span className="font-semibold text-foreground capitalize">{transportMode}</span>
        </div>
        <div className="flex items-center gap-1 text-primary">
          <MapPin className="h-4 w-4" />
          <span className="text-sm font-medium">{dropName}</span>
        </div>
      </div>
      <p className="text-sm text-muted-foreground mb-2">{instruction}</p>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Building className="h-4 w-4 text-primary/70" />
        <span>{landmark}</span>
      </div>
    </div>
  );
}
