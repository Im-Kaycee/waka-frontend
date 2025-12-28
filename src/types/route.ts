export interface Place {
  id: number;
  canonical_name: string;
}

export interface RouteStep {
  order: number;
  mode: 'walk' | 'cab' | 'bus';
  instruction: string;
  drop_name: string;
  landmark: string;
  estimated_fare?: string;
}

export interface Route {
  id: number;
  destination: Place;
  starting_places: Place[];
  recommended: boolean;
  estimated_time: string;
  difficulty: 'easy' | 'medium' | 'hard';
  notes?: string;
  steps: RouteStep[];
}

export interface SearchParams {
  from: Place | null;
  to: Place | null;
}
