import { useState, useEffect } from "react"; // ADD useEffect HERE!
import {
  Submission,
  SubmissionStep,
  updateSubmission,
  approveSubmission,
  rejectSubmission,
} from "@/services/admin";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Check, X, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

interface SubmissionEditModalProps {
  submission: Submission | null;
  open: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export function SubmissionEditModal({
  submission,
  open,
  onClose,
  onUpdate,
}: SubmissionEditModalProps) {
  const [loading, setLoading] = useState(false);
  const [destination, setDestination] = useState("");
  const [steps, setSteps] = useState<SubmissionStep[]>([]);

  // Reset state when submission changes
  useEffect(() => {
    if (submission) {
      setDestination(submission.destination);
      setSteps(submission.steps);
    }
  }, [submission]);

  const handleStepChange = (
    index: number,
    field: keyof SubmissionStep,
    value: string | number,
  ) => {
    setSteps((prev) =>
      prev.map((step, i) => (i === index ? { ...step, [field]: value } : step)),
    );
  };

  const handleAddStep = () => {
    const newStep: SubmissionStep = {
      id: Date.now(),
      order: steps.length + 1,
      mode: "walk",
      instruction: "",
      drop_name: "",
      landmark: "",
    };
    setSteps((prev) => [...prev, newStep]);
  };

  const handleRemoveStep = (index: number) => {
    setSteps((prev) =>
      prev
        .filter((_, i) => i !== index)
        .map((step, i) => ({ ...step, order: i + 1 })),
    );
  };

  const handleSave = async () => {
    if (!submission) return;

    setLoading(true);
    const result = await updateSubmission(submission.id, {
      destination,
      steps,
    });
    setLoading(false);

    if (result.success) {
      toast.success("Submission updated");
      onUpdate();
    } else {
      toast.error(result.error || "Failed to update");
    }
  };

  const handleApprove = async () => {
    if (!submission) return;

    setLoading(true);
    const result = await approveSubmission(submission.id);
    setLoading(false);

    if (result.success) {
      toast.success("Submission approved");
      onUpdate();
      onClose();
    } else {
      toast.error(result.error || "Failed to approve");
    }
  };

  const handleReject = async () => {
    if (!submission) return;

    setLoading(true);
    const result = await rejectSubmission(submission.id);
    setLoading(false);

    if (result.success) {
      toast.success("Submission rejected");
      onUpdate();
      onClose();
    } else {
      toast.error(result.error || "Failed to reject");
    }
  };

  if (!submission) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Submission</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="destination">Destination</Label>
            <Input
              id="destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Destination name"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Route Steps</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddStep}
                className="h-8"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Step
              </Button>
            </div>

            {steps.map((step, index) => (
              <div
                key={step.id}
                className="border border-border rounded-lg p-3 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Step {index + 1}
                  </span>
                  {steps.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveStep(index)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Mode</Label>
                    <Select
                      value={step.mode}
                      onValueChange={(value) =>
                        handleStepChange(index, "mode", value)
                      }
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="walk">Walk</SelectItem>
                        <SelectItem value="bus">Bus</SelectItem>
                        <SelectItem value="cab">Cab</SelectItem>
                        <SelectItem value="keke">Keke</SelectItem>
                        <SelectItem value="bike">Bike</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Drop Name</Label>
                    <Input
                      value={step.drop_name}
                      onChange={(e) =>
                        handleStepChange(index, "drop_name", e.target.value)
                      }
                      placeholder="Drop location"
                      className="h-9"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Instruction</Label>
                  <Input
                    value={step.instruction}
                    onChange={(e) =>
                      handleStepChange(index, "instruction", e.target.value)
                    }
                    placeholder="Step instruction"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Landmark</Label>
                  <Input
                    value={step.landmark}
                    onChange={(e) =>
                      handleStepChange(index, "landmark", e.target.value)
                    }
                    placeholder="Nearby landmark"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-4 border-t">
          <div className="flex gap-2">
            <Button
              onClick={handleApprove}
              disabled={loading}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4 mr-1" />
              )}
              Approve
            </Button>
            <Button
              onClick={handleReject}
              disabled={loading}
              variant="destructive"
              className="flex-1"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <X className="h-4 w-4 mr-1" />
              )}
              Reject
            </Button>
          </div>
          <Button
            onClick={handleSave}
            disabled={loading}
            variant="outline"
            className="w-full"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
