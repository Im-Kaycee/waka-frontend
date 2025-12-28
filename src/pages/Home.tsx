import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowDown } from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGreeting } from "@/hooks/useGreeting";
import { cn } from "@/lib/utils";

export default function Home() {
  const navigate = useNavigate();
  const greeting = useGreeting("Paul");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const handleSwap = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  const handleSearch = () => {
    if (from && to) {
      // Store search params and navigate
      sessionStorage.setItem(
        "searchParams",
        JSON.stringify({
          from: { id: "1", canonical_name: from },
          to: { id: "2", canonical_name: to },
        })
      );
      navigate("/routes");
    }
  };

  const canSearch = from.trim() && to.trim();

  return (
    <MobileLayout>
      <div className="flex flex-col min-h-[calc(100vh-5rem)] justify-center px-6 py-8">
        <h1 className="text-2xl font-bold text-foreground text-center mb-8 animate-fade-in">
          {greeting}
        </h1>

        <div className="space-y-2 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <Input
            placeholder="Where are you coming from?"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="text-base"
          />

          <button
            onClick={handleSwap}
            className={cn(
              "mx-auto flex items-center justify-center w-10 h-10 rounded-full",
              "bg-muted text-muted-foreground transition-all duration-200",
              "hover:bg-primary hover:text-primary-foreground hover:rotate-180",
              "active:scale-90 tap-highlight-none"
            )}
          >
            <ArrowDown className="h-5 w-5" />
          </button>

          <Input
            placeholder="Where are you going?"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="text-base"
          />
        </div>

        <div className="mt-8 flex justify-center animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <Button
            onClick={handleSearch}
            disabled={!canSearch}
            size="lg"
            className={cn(
              "min-w-[180px]",
              canSearch && "animate-pulse-ring"
            )}
          >
            Search Routes
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
}
