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
        "w-full bg-white rounded-2xl border-2 border-emerald-400 p-5 text-left",
        "transition-all duration-200",
        "hover:border-emerald-500 hover:shadow-md hover:-translate-y-0.5",
        "active:scale-[0.98]",
        "focus:outline-none focus:ring-2 focus:ring-emerald-400/50",
        className
      )}
      style={style}
    >
      {isRecommended && (
        <div className="inline-flex items-center bg-emerald-500 text-white text-sm font-semibold px-4 py-1.5 rounded-md mb-3">
          Recommended
        </div>
      )}

      <div className="flex items-center gap-4 mb-2.5">
        <div className="flex items-center gap-1.5">
          <MapPin className="h-5 w-5 text-emerald-500" />
          <span className="text-sm font-medium text-gray-900">{duration}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-sm font-medium text-gray-900">
            {difficulty}
          </span>
        </div>
      </div>

      <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
    </button>
  );
}

// Demo Component
export default function RouteCardDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white p-6">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="bg-emerald-500 text-white p-6 rounded-t-3xl mb-6">
          <button className="text-white text-sm mb-2">← Back</button>
          <h1 className="text-2xl font-semibold">Place A to Place B</h1>
        </div>

        {/* Available Routes Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 text-center mb-6">
            Available Routes
          </h2>

          <RouteCard
            duration="40 mins"
            difficulty="Easy"
            description="This route follows Kuje"
            isRecommended
          />

          <RouteCard
            duration="40 mins"
            difficulty="Easy"
            description="This route follows Kuje"
          />

          <RouteCard
            duration="40 mins"
            difficulty="Easy"
            description="This route follows Kuje"
          />
        </div>
      </div>
    </div>
  );
}
