// API Configuration - Update this to your Django server URL
export const API_BASE_URL = 'https://api.wakaapp.online';

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/api/auth/login/',
  REGISTER: '/api/auth/register/',
  REFRESH_TOKEN: '/api/auth/token/refresh/',
  CHANGE_PASSWORD: '/api/auth/change-password/',
  
  // Search
  DESTINATIONS: '/api/v1/search/destinations/',
  STARTING_PLACES: (destinationId: number) => `/api/v1/search/destinations/${destinationId}/starting-places/`,
  
  // Routes
  ROUTE_LOOKUP: '/api/v1/routes/lookup/',
  ROUTE_DETAIL: (routeId: number) => `/api/v1/routes/${routeId}/`,
  
  // Route Steps
  ROUTE_FARES: (stepId: string) => `/api/v1/route-steps/${stepId}/fares/`,
  
  // Submissions
  SUBMISSIONS: '/api/v1/submissions/',
  SUBMISSION_DETAIL: (id: number) => `/api/v1/submissions/${id}/`,
  SUBMISSION_APPROVE: (id: number) => `/api/v1/submissions/${id}/approve/`,
  SUBMISSION_REJECT: (id: number) => `/api/v1/submissions/${id}/reject/`,
};

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
};
