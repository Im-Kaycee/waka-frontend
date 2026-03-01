import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { RouteStepCard } from "@/components/route/RouteStepCard";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getRouteDetail } from "@/services/routes";
import type { Route, Place } from "@/services/routes";

interface SearchParams {
  from: Place;
  to: Place;
}

export default function RouteSteps() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [route, setRoute] = useState<Route | null>(null);
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);

  useEffect(() => {
    const routeStr = sessionStorage.getItem("selectedRoute");
    const paramsStr = sessionStorage.getItem("searchParams");

    // look for routeId query param (allows sharing links)
    const query = new URLSearchParams(location.search);
    const routeId = query.get("routeId");

    if (routeStr) {
      setRoute(JSON.parse(routeStr));
      if (paramsStr) {
        setSearchParams(JSON.parse(paramsStr));
      }
    } else if (routeId) {
      // fetch from API using routeId
      getRouteDetail(Number(routeId)).then((r) => {
        if (r) {
          setRoute(r);
          // derive a reasonable title from the route data
          if (r.starting_places && r.starting_places.length > 0) {
            setSearchParams({ from: r.starting_places[0], to: r.destination });
          }
        } else {
          navigate("/routes");
        }
      });
    } else {
      navigate("/routes");
    }
  }, [navigate, location.search]);

  const title = searchParams
    ? `${searchParams.from.canonical_name} to ${searchParams.to.canonical_name}`
    : "Route Details";

  const handleShare = async () => {
    const base = `${window.location.origin}/route-steps`;
    const url = route ? `${base}?routeId=${route.id}` : window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link copied",
        description: "You can now share this route with others.",
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Could not copy link to clipboard.",
        variant: "destructive",
      });
    }
  };

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
        <div className="flex items-center justify-between mb-4 animate-fade-in">
          <h2 className="text-xl font-bold text-foreground">Route Steps</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="flex items-center gap-1"
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </div>
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
          <div
            className="mt-4 bg-accent rounded-xl p-4 animate-fade-in"
            style={{ animationDelay: "0.3s" }}
          >
            <h3 className="font-semibold text-foreground mb-2">Notes</h3>
            <p className="text-sm text-muted-foreground">{route.notes}</p>
          </div>
        )}
      </div>
    </MobileLayout>
  );
}
