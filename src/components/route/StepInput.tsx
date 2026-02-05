import { Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface StepInputProps {
  stepNumber: number;
  transportMode: string;
  instruction: string;
  dropName: string;
  landmark: string;
  onTransportModeChange: (value: string) => void;
  onInstructionChange: (value: string) => void;
  onDropNameChange: (value: string) => void;
  onLandmarkChange: (value: string) => void;
  onDelete: () => void;
  canDelete: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function StepInput({
  stepNumber,
  transportMode,
  instruction,
  dropName,
  landmark,
  onTransportModeChange,
  onInstructionChange,
  onDropNameChange,
  onLandmarkChange,
  onDelete,
  canDelete,
  className,
  style,
}: StepInputProps) {
  return (
    <div
      className={cn(
        "bg-card rounded-xl border-2 border-primary/30 p-4 space-y-3",
        "transition-all duration-300 shadow-card",
        className,
      )}
      style={style}
    >
      <div className="flex items-center justify-between">
        <span className="font-semibold text-foreground">{stepNumber}</span>
        {canDelete && (
          <button
            onClick={onDelete}
            className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-all duration-200 active:scale-90 tap-highlight-none"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Transport Mode Select */}
      <select
        value={transportMode}
        onChange={(e) => onTransportModeChange(e.target.value)}
        className="flex h-12 w-full rounded-xl border-2 border-primary/30 bg-card px-4 py-3 text-base text-foreground transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      >
        <option value="">Select mode of transport</option>
        <option value="walk">Walk</option>
        <option value="cab">Cab</option>
        <option value="bus">Bus</option>
        <option value="keke">Keke</option>
        <option value="bike">Bike</option>
      </select>

      <Input
        placeholder="Enter Instruction"
        value={instruction}
        onChange={(e) => onInstructionChange(e.target.value)}
      />
      <Input
        placeholder="Enter Drop Name"
        value={dropName}
        onChange={(e) => onDropNameChange(e.target.value)}
      />
      <Input
        placeholder="Enter Landmark (What should they see?)"
        value={landmark}
        onChange={(e) => onLandmarkChange(e.target.value)}
      />
    </div>
  );
}
