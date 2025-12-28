export interface Place {
  id: string;
  canonical_name: string;
}

export interface RouteStep {
  id: string;
  transportMode: string;
  instruction: string;
  dropName: string;
  landmark: string;
}

export interface Route {
  id: string;
  duration: string;
  difficulty: string;
  description: string;
  isRecommended?: boolean;
  steps: RouteStep[];
  notes?: string;
}

export interface SearchParams {
  from: Place | null;
  to: Place | null;
}
