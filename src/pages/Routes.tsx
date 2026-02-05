import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { RouteCard } from "@/components/route/RouteCard";
import { EmptyState } from "@/components/common/EmptyState";
import { RouteIcon } from "@/components/common/RouteIcon";
import { lookupRoutes, type Route, type Place } from "@/services/routes";

interface SearchParams {
  from: Place;
  to: Place;
}

export default function Routes() {
  const navigate = useNavigate();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const paramsStr = sessionStorage.getItem("searchParams");
    if (!paramsStr) {
      navigate("/");
      return;
    }

    const params: SearchParams = JSON.parse(paramsStr);
    setSearchParams(params);

    // Fetch routes from API
    const fetchRoutes = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await lookupRoutes(params.to.id, params.from.id);
        setRoutes(data);
      } catch (err) {
        setError("Failed to load routes. Please check your connection.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, [navigate]);

  const handleRouteClick = (route: Route) => {
    sessionStorage.setItem("selectedRoute", JSON.stringify(route));
    navigate("/route-steps");
  };

  const title = searchParams
    ? `${searchParams.from.canonical_name} to ${searchParams.to.canonical_name}`
    : "Available Routes";

  if (loading) {
    return (
      <MobileLayout>
        <PageHeader title={title} showBack />
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
          <p className="text-muted-foreground">Finding routes...</p>
        </div>
      </MobileLayout>
    );
  }

  if (error) {
    return (
      <MobileLayout>
        <PageHeader title={title} showBack />
        <EmptyState
          icon={<RouteIcon size="lg" />}
          title="Error Loading Routes"
          description={error}
          actionLabel="Try Again"
          onAction={() => window.location.reload()}
          className="min-h-[60vh]"
        />
      </MobileLayout>
    );
  }

  if (routes.length === 0) {
    return (
      <MobileLayout>
        <PageHeader title={title} showBack />
        <EmptyState
          icon={<RouteIcon size="lg" />}
          title="No Routes Found for this Search"
          actionLabel="Search Other Routes"
          onAction={() => navigate("/")}
          className="min-h-[60vh]"
        />
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <PageHeader title={title} showBack />
      <div className="px-4 py-6">
        <h2 className="text-xl font-bold text-foreground mb-1 animate-fade-in">
          Available Routes
        </h2>
        <p className="text-sm text-muted-foreground mb-4 animate-fade-in">
          {routes.length} route{routes.length !== 1 ? "s" : ""} found
        </p>
        <div className="space-y-3">
          {routes.map((route, index) => (
            <RouteCard
              key={route.id}
              duration={route.estimated_time}
              difficulty={
                route.difficulty
                  ? route.difficulty.charAt(0).toUpperCase() +
                    route.difficulty.slice(1)
                  : ""
              }
              description={
                route.notes ||
                `${route.steps.length} step${
                  route.steps.length !== 1 ? "s" : ""
                }`
              }
              isRecommended={route.recommended}
              onClick={() => handleRouteClick(route)}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            />
          ))}
        </div>
      </div>
    </MobileLayout>
  );
}
