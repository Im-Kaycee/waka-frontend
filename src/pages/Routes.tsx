import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { RouteCard } from "@/components/route/RouteCard";
import { EmptyState } from "@/components/common/EmptyState";
import { RouteIcon } from "@/components/common/RouteIcon";
import type { Route, SearchParams } from "@/types/route";

// Mock data for demonstration
const mockRoutes: Route[] = [
  {
    id: "1",
    duration: "40 mins",
    difficulty: "Easy",
    description: "This route follows Kuje",
    isRecommended: true,
    steps: [
      { id: "1", transportMode: "Cab", instruction: "Take a cab to Secretariat. Drop by Eagle square", dropName: "Eagle Square", landmark: "Eagle Square Gate" },
      { id: "2", transportMode: "Bike", instruction: "Take a cab to Secretariat. Drop by Eagle square", dropName: "Eagle Square", landmark: "Eagle Square Gate" },
      { id: "3", transportMode: "Walk", instruction: "Take a cab to Secretariat. Drop by Eagle square", dropName: "Eagle Square", landmark: "Eagle Square Gate" },
    ],
  },
  {
    id: "2",
    duration: "40 mins",
    difficulty: "Easy",
    description: "This route follows Kuje",
    steps: [
      { id: "1", transportMode: "Bus", instruction: "Take the express bus", dropName: "Central Station", landmark: "Main entrance" },
    ],
  },
  {
    id: "3",
    duration: "40 mins",
    difficulty: "Easy",
    description: "This route follows Kuje",
    steps: [
      { id: "1", transportMode: "Train", instruction: "Take the metro line 2", dropName: "Metro Stop", landmark: "Exit A" },
    ],
  },
];

export default function Routes() {
  const navigate = useNavigate();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const paramsStr = sessionStorage.getItem("searchParams");
    if (paramsStr) {
      setSearchParams(JSON.parse(paramsStr));
    }
    
    // Simulate API call
    setTimeout(() => {
      setRoutes(mockRoutes);
      setLoading(false);
    }, 500);
  }, []);

  const handleRouteClick = (route: Route) => {
    sessionStorage.setItem("selectedRoute", JSON.stringify(route));
    navigate("/route-steps");
  };

  const title = searchParams
    ? `${searchParams.from?.canonical_name} to ${searchParams.to?.canonical_name}`
    : "Available Routes";

  if (loading) {
    return (
      <MobileLayout>
        <PageHeader title={title} showBack />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
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
        <h2 className="text-xl font-bold text-foreground mb-4 animate-fade-in">
          Available Routes
        </h2>
        <div className="space-y-3">
          {routes.map((route, index) => (
            <RouteCard
              key={route.id}
              duration={route.duration}
              difficulty={route.difficulty}
              description={route.description}
              isRecommended={route.isRecommended}
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
