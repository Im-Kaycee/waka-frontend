import { useState } from "react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StepInput } from "@/components/route/StepInput";
import { useToast } from "@/hooks/use-toast";

interface RouteStepInput {
  id: string;
  transportMode: string;
  instruction: string;
  dropName: string;
  landmark: string;
}

const createEmptyStep = (): RouteStepInput => ({
  id: crypto.randomUUID(),
  transportMode: "",
  instruction: "",
  dropName: "",
  landmark: "",
});

export default function RouteSubmission() {
  const { toast } = useToast();
  const [startingPoint, setStartingPoint] = useState("");
  const [destination, setDestination] = useState("");
  const [steps, setSteps] = useState<RouteStepInput[]>([createEmptyStep(), createEmptyStep()]);

  const updateStep = (id: string, field: keyof RouteStepInput, value: string) => {
    setSteps((prev) =>
      prev.map((step) => (step.id === id ? { ...step, [field]: value } : step))
    );
  };

  const addStep = () => {
    setSteps((prev) => [...prev, createEmptyStep()]);
  };

  const deleteStep = (id: string) => {
    if (steps.length > 1) {
      setSteps((prev) => prev.filter((step) => step.id !== id));
    }
  };

  const handleSaveProgress = () => {
    toast({
      title: "Progress Saved",
      description: "Your route details have been saved locally.",
    });
  };

  const handleSaveAll = () => {
    if (!startingPoint || !destination) {
      toast({
        title: "Missing Information",
        description: "Please fill in the starting point and destination.",
        variant: "destructive",
      });
      return;
    }

    const incompleteSteps = steps.some(
      (step) => !step.transportMode || !step.instruction || !step.dropName
    );

    if (incompleteSteps) {
      toast({
        title: "Incomplete Steps",
        description: "Please fill in all required fields for each step.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Route Submitted",
      description: "Your route has been submitted for review.",
    });

    // Reset form
    setStartingPoint("");
    setDestination("");
    setSteps([createEmptyStep(), createEmptyStep()]);
  };

  return (
    <MobileLayout>
      <PageHeader title="Route Submission" showBack />
      <div className="px-4 py-6 space-y-6">
        <h2 className="text-xl font-bold text-foreground text-center animate-fade-in">
          Route Submission
        </h2>

        {/* Route Details Card */}
        <div
          className="bg-card rounded-xl border-2 border-primary/30 p-4 space-y-4 shadow-card animate-scale-in"
        >
          <h3 className="text-center font-semibold text-foreground">
            Enter the Route Details
          </h3>
          <Input
            placeholder="Enter Starting Point"
            value={startingPoint}
            onChange={(e) => setStartingPoint(e.target.value)}
          />
          <Input
            placeholder="Enter Destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
          <div className="flex justify-center">
            <Button onClick={handleSaveProgress} size="default">
              Save Progress
            </Button>
          </div>
        </div>

        {/* Route Steps Card */}
        <div
          className="bg-card rounded-xl border-2 border-primary/30 p-4 space-y-4 shadow-card animate-scale-in"
          style={{ animationDelay: "0.1s" }}
        >
          <h3 className="text-center font-semibold text-foreground">
            Enter the Route Steps
          </h3>
          <div className="space-y-4">
            {steps.map((step, index) => (
              <StepInput
                key={step.id}
                stepNumber={index + 1}
                transportMode={step.transportMode}
                instruction={step.instruction}
                dropName={step.dropName}
                landmark={step.landmark}
                onTransportModeChange={(v) => updateStep(step.id, "transportMode", v)}
                onInstructionChange={(v) => updateStep(step.id, "instruction", v)}
                onDropNameChange={(v) => updateStep(step.id, "dropName", v)}
                onLandmarkChange={(v) => updateStep(step.id, "landmark", v)}
                onDelete={() => deleteStep(step.id)}
                canDelete={steps.length > 1}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              />
            ))}
          </div>
          <div className="flex justify-center gap-3 pt-2">
            <Button variant="outline" onClick={addStep}>
              Add Step
            </Button>
            <Button onClick={handleSaveAll}>Save All</Button>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
