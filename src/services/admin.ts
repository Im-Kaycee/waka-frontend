import { API_BASE_URL, API_ENDPOINTS } from '@/config/api';
import { getAuthHeaders, refreshAccessToken, getAccessToken } from './auth';

export interface Submission {
  id: number;
  destination: string;
  starting_point?: string;
  starting_point_text?: string;
  city: string;
  status: 'submitted' | 'approved' | 'rejected';
  submitted_by: string;
  submitted_at: string;
  steps: SubmissionStep[];
}

export interface SubmissionStep {
  id: number;
  order: number;
  mode: 'walk' | 'cab' | 'bus';
  instruction: string;
  drop_name: string;
  landmark: string;
}

async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  console.log("🔐 fetchWithAuth called:", url);
  console.log("🔐 Auth headers:", getAuthHeaders());
  
  let response = await fetch(url, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  });

  console.log("📡 Response status:", response.status);

  if (response.status === 401 && getAccessToken()) {
    console.log("🔄 Token expired, refreshing...");
    const newToken = await refreshAccessToken();
    if (newToken) {
      console.log("✅ Token refreshed, retrying request...");
      response = await fetch(url, {
        ...options,
        headers: {
          ...getAuthHeaders(),
          ...options.headers,
        },
      });
      console.log("📡 Retry response status:", response.status);
    }
  }

  return response;
}

export async function getSubmissions(status?: string): Promise<Submission[]> {
  try {
    const url = `${API_BASE_URL}${API_ENDPOINTS.SUBMISSIONS}`;
    console.log("🌐 Fetching submissions from:", url);
    
    const response = await fetchWithAuth(url);
    
    console.log("📊 Response OK?:", response.ok);
    console.log("📊 Response status:", response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log("✅ Submissions data:", data);
      return data;
    } else {
      const errorText = await response.text();
      console.error("❌ API Error:", errorText);
      return [];
    }
  } catch (error) {
    console.error('❌ Error fetching submissions:', error);
    return [];
  }
}

export async function getSubmissionDetail(id: number): Promise<Submission | null> {
  try {
    const url = `${API_BASE_URL}${API_ENDPOINTS.SUBMISSION_DETAIL(id)}`;
    const response = await fetchWithAuth(url);
    
    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (error) {
    console.error('Error fetching submission detail:', error);
    return null;
  }
}

export async function updateSubmission(
  id: number, 
  data: Partial<Omit<Submission, 'id' | 'submitted_by' | 'submitted_at'>>
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}${API_ENDPOINTS.SUBMISSION_DETAIL(id)}edit`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    
    if (response.ok) {
      return { success: true };
    } else {
      const error = await response.json();
      return { success: false, error: error.detail || 'Update failed' };
    }
  } catch (error) {
    console.error('Error updating submission:', error);
    return { success: false, error: 'Network error. Please try again.' };
  }
}

export async function approveSubmission(id: number): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}${API_ENDPOINTS.SUBMISSION_APPROVE(id)}`, {
      method: 'POST',
    });
    
    if (response.ok) {
      return { success: true };
    } else {
      const error = await response.json();
      return { success: false, error: error.detail || 'Approval failed' };
    }
  } catch (error) {
    console.error('Error approving submission:', error);
    return { success: false, error: 'Network error. Please try again.' };
  }
}

export async function rejectSubmission(id: number): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}${API_ENDPOINTS.SUBMISSION_REJECT(id)}`, {
      method: 'POST',
    });
    
    if (response.ok) {
      return { success: true };
    } else {
      const error = await response.json();
      return { success: false, error: error.detail || 'Rejection failed' };
    }
  } catch (error) {
    console.error('Error rejecting submission:', error);
    return { success: false, error: 'Network error. Please try again.' };
  }
}