import {
  Car,
  Bike,
  Footprints,
  Bus,
  Train,
  MapPin,
  Building,
} from "lucide-react";
import { cn } from "@/lib/utils";

const transportIcons: Record<string, React.ElementType> = {
  cab: Car,
  taxi: Car,
  car: Car,
  bike: Bike,
  walk: Footprints,
  bus: Bus,
  train: Train,
  keke: Car,
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
        "bg-white border-b-2 border-emerald-400 pb-4 last:border-b-0 mb-4 last:mb-0",
        className,
      )}
      style={style}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <TransportIcon className="h-5 w-5 text-emerald-500" />
          <span className="font-semibold text-gray-900 capitalize text-sm">
            {transportMode}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <MapPin className="h-4 w-4 text-emerald-500" />
          <span className="text-sm font-medium text-gray-900">{dropName}</span>
        </div>
      </div>

      <p className="text-sm text-gray-700 mb-3 leading-relaxed">
        {instruction}
      </p>

      <div className="flex items-center gap-2">
        <Building className="h-4 w-4 text-emerald-500" />
        <span className="text-sm text-gray-700">{landmark}</span>
      </div>
    </div>
  );
}

// Demo Component
export default function RouteStepDemo() {
  const steps = [
    {
      transportMode: "Cab",
      dropName: "Eagle Square",
      instruction: "Take a cab to Secretariat. Drop by Eagle square",
      landmark: "Eagle Square Gate",
    },
    {
      transportMode: "Bike",
      dropName: "Eagle Square",
      instruction: "Take a cab to Secretariat. Drop by Eagle square",
      landmark: "Eagle Square Gate",
    },
    {
      transportMode: "Walk",
      dropName: "Eagle Square",
      instruction: "Take a cab to Secretariat. Drop by Eagle square",
      landmark: "Eagle Square Gate",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white p-6">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="bg-emerald-500 text-white p-6 rounded-t-3xl mb-6">
          <button className="text-white text-sm mb-2">← Back</button>
          <h1 className="text-2xl font-semibold">Place A to Place B</h1>
        </div>

        {/* Route Steps Section */}
        <div className="bg-white rounded-2xl border-2 border-gray-300 p-5">
          <h2 className="text-xl font-bold text-gray-900 text-center mb-6">
            Route Steps
          </h2>

          <div className="space-y-0">
            {steps.map((step, index) => (
              <RouteStepCard
                key={index}
                transportMode={step.transportMode}
                dropName={step.dropName}
                instruction={step.instruction}
                landmark={step.landmark}
              />
            ))}
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-emerald-500 p-4 flex justify-around">
          <button className="text-white">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </button>
          <button className="text-white">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
