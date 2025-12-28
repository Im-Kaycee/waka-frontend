import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { RouteStepCard } from "@/components/route/RouteStepCard";
import type { Route, Place } from "@/services/routes";

interface SearchParams {
  from: Place;
  to: Place;
}

export default function RouteSteps() {
  const navigate = useNavigate();
  const [route, setRoute] = useState<Route | null>(null);
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);

  useEffect(() => {
    const routeStr = sessionStorage.getItem("selectedRoute");
    const paramsStr = sessionStorage.getItem("searchParams");
    
    if (!routeStr) {
      navigate("/routes");
      return;
    }
    
    setRoute(JSON.parse(routeStr));
    if (paramsStr) {
      setSearchParams(JSON.parse(paramsStr));
    }
  }, [navigate]);

  const title = searchParams
    ? `${searchParams.from.canonical_name} to ${searchParams.to.canonical_name}`
    : "Route Details";

  if (!route) {
    return (
      <MobileLayout>
        <PageHeader title={title} showBack />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </MobileLayout>
    );
  }

  // Sort steps by order
  const sortedSteps = [...route.steps].sort((a, b) => a.order - b.order);

  return (
    <MobileLayout>
      <PageHeader title={title} showBack />
      <div className="px-4 py-6">
        <h2 className="text-xl font-bold text-foreground mb-4 animate-fade-in">
          Route Steps
        </h2>
        <div className="bg-card rounded-xl border-2 border-primary/30 p-4 shadow-card animate-scale-in">
          {sortedSteps.map((step, index) => (
            <RouteStepCard
              key={step.order}
              transportMode={step.mode}
              dropName={step.drop_name}
              instruction={step.instruction}
              landmark={step.landmark}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.15}s` }}
            />
          ))}
        </div>
        
        {route.notes && (
          <div className="mt-4 bg-accent rounded-xl p-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <h3 className="font-semibold text-foreground mb-2">Notes</h3>
            <p className="text-sm text-muted-foreground">{route.notes}</p>
          </div>
        )}
      </div>
    </MobileLayout>
  );
}
