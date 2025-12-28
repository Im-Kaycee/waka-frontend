import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  showBack?: boolean;
  className?: string;
}

export function PageHeader({ title, showBack = false, className }: PageHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className={cn("bg-primary text-primary-foreground sticky top-0 z-40", className)}>
      <div className="flex items-center h-14 px-4">
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-sm font-medium mr-4 transition-all duration-200 hover:opacity-80 active:scale-95 tap-highlight-none"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </button>
        )}
        <h1 className="text-lg font-semibold flex-1 text-center pr-16">{title}</h1>
      </div>
    </header>
  );
}
