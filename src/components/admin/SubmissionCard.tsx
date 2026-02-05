import { Submission } from "@/services/admin";
import { MapPin, Clock, User, ChevronRight } from "lucide-react";
import { format, isValid, parseISO } from "date-fns";

interface SubmissionCardProps {
  submission: Submission;
  onClick: () => void;
}

export function SubmissionCard({ submission, onClick }: SubmissionCardProps) {
  // Safely format the date
  const formatDate = (dateString: string) => {
    try {
      // Try parsing as ISO date first
      const date = parseISO(dateString);
      if (isValid(date)) {
        return format(date, "MMM d, yyyy");
      }

      // If that fails, try creating a new Date
      const fallbackDate = new Date(dateString);
      if (isValid(fallbackDate)) {
        return format(fallbackDate, "MMM d, yyyy");
      }

      // If all else fails, return the raw string
      return dateString;
    } catch (error) {
      console.error("Error formatting date:", dateString, error);
      return "Invalid date";
    }
  };

  return (
    <button
      onClick={onClick}
      className="w-full bg-card border border-border rounded-xl p-4 text-left transition-all duration-200 hover:shadow-lg hover:border-primary/30 hover:-translate-y-0.5 active:scale-[0.98]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate">
            {submission.destination}
          </h3>
          {submission.starting_point && (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
              <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="truncate">
                From: {submission.starting_point_text}
              </span>
            </div>
          )}
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
      </div>

      <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <User className="h-3.5 w-3.5" />
          <span>{submission.submitted_by}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          <span>{formatDate(submission.submitted_at)}</span>
        </div>
      </div>

      <div className="mt-3">
        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
          {submission.steps.length} step
          {submission.steps.length !== 1 ? "s" : ""}
        </span>
      </div>
    </button>
  );
}
