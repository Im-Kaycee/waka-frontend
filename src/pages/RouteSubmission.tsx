import { useState } from "react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StepInput } from "@/components/route/StepInput";
import { useToast } from "@/hooks/use-toast";
import { submitRoute, type RouteSubmissionStep } from "@/services/routes";
import { isAuthenticated } from "@/services/auth";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

interface StepInputData {
  id: string;
  mode: 'walk' | 'cab' | 'bus' | '';
  instruction: string;
  drop_name: string;
  landmark: string;
}

const createEmptyStep = (): StepInputData => ({
  id: crypto.randomUUID(),
  mode: '',
  instruction: "",
  drop_name: "",
  landmark: "",
});

export default function RouteSubmission() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [destination, setDestination] = useState("");
  const [startingPoint, setStartingPoint] = useState("");
  const [steps, setSteps] = useState<StepInputData[]>([createEmptyStep(), createEmptyStep()]);
  const [submitting, setSubmitting] = useState(false);

  const updateStep = (id: string, field: keyof StepInputData, value: string) => {
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
    const data = {
      destination,
      startingPoint,
      steps,
    };
    localStorage.setItem('routeSubmissionDraft', JSON.stringify(data));
    toast({
      title: "Progress Saved",
      description: "Your route details have been saved locally.",
    });
  };

  const handleSaveAll = async () => {
    if (!isAuthenticated()) {
      toast({
        title: "Login Required",
        description: "Please login to submit a route.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    if (!destination) {
      toast({
        title: "Missing Information",
        description: "Please enter the destination.",
        variant: "destructive",
      });
      return;
    }

    const incompleteSteps = steps.some(
      (step) => !step.mode || !step.instruction || !step.drop_name
    );

    if (incompleteSteps) {
      toast({
        title: "Incomplete Steps",
        description: "Please fill in mode, instruction, and drop name for each step.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    const submissionSteps: RouteSubmissionStep[] = steps.map((step, index) => ({
      order: index + 1,
      mode: step.mode as 'walk' | 'cab' | 'bus',
      instruction: step.instruction,
      drop_name: step.drop_name,
      landmark: step.landmark,
    }));

    const result = await submitRoute({
      destination,
      city: 1, // You may want to make this dynamic
      steps: submissionSteps,
    });

    setSubmitting(false);

    if (result.success) {
      toast({
        title: "Route Submitted",
        description: "Your route has been submitted for review.",
      });

      // Clear form
      setDestination("");
      setStartingPoint("");
      setSteps([createEmptyStep(), createEmptyStep()]);
      localStorage.removeItem('routeSubmissionDraft');
    } else {
      toast({
        title: "Submission Failed",
        description: result.error || "Please try again.",
        variant: "destructive",
      });
    }
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
                transportMode={step.mode}
                instruction={step.instruction}
                dropName={step.drop_name}
                landmark={step.landmark}
                onTransportModeChange={(v) => updateStep(step.id, "mode", v)}
                onInstructionChange={(v) => updateStep(step.id, "instruction", v)}
                onDropNameChange={(v) => updateStep(step.id, "drop_name", v)}
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
            <Button onClick={handleSaveAll} disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                "Save All"
              )}
            </Button>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
