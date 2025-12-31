import { API_BASE_URL, API_ENDPOINTS } from '@/config/api';
import { getAuthHeaders, refreshAccessToken, getAccessToken } from './auth';

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

async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  let response = await fetch(url, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  });

  // If unauthorized, try to refresh token
  if (response.status === 401 && getAccessToken()) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      response = await fetch(url, {
        ...options,
        headers: {
          ...getAuthHeaders(),
          ...options.headers,
        },
      });
    }
  }

  return response;
}

export async function searchDestinations(
  query: string,
  signal?: AbortSignal
): Promise<Place[]> {
  try {
    const url = `${API_BASE_URL}${API_ENDPOINTS.DESTINATIONS}?q=${encodeURIComponent(query)}`;
    const response = await fetch(url, { signal });
    
    if (response.ok) {
      return await response.json();
    }
    return [];
  } catch (error) {
    if ((error as Error).name === 'AbortError') {
      throw error;
    }
    console.error('Error searching destinations:', error);
    return [];
  }
}

export async function searchStartingPlaces(
  destinationId: number,
  query: string,
  signal?: AbortSignal
): Promise<Place[]> {
  try {
    const url = `${API_BASE_URL}${API_ENDPOINTS.STARTING_PLACES(destinationId)}?q=${encodeURIComponent(query)}`;
    const response = await fetch(url, { signal });
    
    if (response.ok) {
      return await response.json();
    }
    return [];
  } catch (error) {
    if ((error as Error).name === 'AbortError') {
      throw error;
    }
    console.error('Error searching starting places:', error);
    return [];
  }
}

export async function lookupRoutes(
  destinationId: number,
  startingPlaceId: number
): Promise<Route[]> {
  try {
    const url = `${API_BASE_URL}${API_ENDPOINTS.ROUTE_LOOKUP}?destination=${destinationId}&start=${startingPlaceId}`;
    const response = await fetch(url);
    
    if (response.ok) {
      return await response.json();
    }
    return [];
  } catch (error) {
    console.error('Error looking up routes:', error);
    return [];
  }
}

export async function getRouteDetail(routeId: number): Promise<Route | null> {
  try {
    const url = `${API_BASE_URL}${API_ENDPOINTS.ROUTE_DETAIL(routeId)}`;
    const response = await fetch(url);
    
    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (error) {
    console.error('Error getting route detail:', error);
    return null;
  }
}

export interface RouteSubmissionStep {
  order: number;
  mode: 'walk' | 'cab' | 'bus';
  instruction: string;
  drop_name: string;
  landmark: string;
}

export interface RouteSubmissionData {
  destination: string;
  starting_point_text: string;
  city: number;
  steps: RouteSubmissionStep[];
}

export async function submitRoute(data: RouteSubmissionData): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/api/v1/submissions/submit-route`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    if (response.ok) {
      return { success: true };
    } else {
      const error = await response.json();
      return { success: false, error: error.detail || 'Submission failed' };
    }
  } catch (error) {
    console.error('Error submitting route:', error);
    return { success: false, error: 'Network error. Please try again.' };
  }
}
