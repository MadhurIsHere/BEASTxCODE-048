import { createClient } from '@supabase/supabase-js';

// Get Supabase configuration from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

// Create a singleton instance of Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to make authenticated requests to our server
export const makeAuthenticatedRequest = async (endpoint: string, options: RequestInit = {}) => {
  const response = await fetch(`${supabaseUrl}/functions/v1/make-server-c392be1f${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${supabaseAnonKey}`,
      ...options.headers,
    },
  });
  
  return response;
};

// Demo accounts helper
export const getDemoAccounts = async () => {
  try {
    const response = await makeAuthenticatedRequest('/demo-accounts');
    if (response.ok) {
      const data = await response.json();
      return data.demoAccounts;
    }
  } catch (error) {
    console.error('Failed to fetch demo accounts:', error);
  }
  return [];
};

// Authentication helpers
export const authenticateUser = async (usernameOrEmail: string, password: string) => {
  try {
    const response = await makeAuthenticatedRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ usernameOrEmail, password })
    });
    
    if (response.ok) {
      const data = await response.json();
      return { success: true, user: data.user, accessToken: data.accessToken };
    } else {
      const errorData = await response.json();
      return { success: false, error: errorData.error };
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return { success: false, error: 'Network error during authentication' };
  }
};

export const registerUser = async (userData: any) => {
  try {
    const response = await makeAuthenticatedRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    
    if (response.ok) {
      const data = await response.json();
      return { success: true, user: data.user };
    } else {
      const errorData = await response.json();
      return { success: false, error: errorData.error };
    }
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, error: 'Network error during registration' };
  }
};

export const updateUserProgress = async (userId: string, progressData: any, accessToken?: string) => {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${supabaseAnonKey}`,
    };
    
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }
    
    const response = await fetch(`${supabaseUrl}/functions/v1/make-server-c392be1f/user/progress`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ userId, ...progressData })
    });
    
    if (response.ok) {
      const data = await response.json();
      return { success: true, message: data.message };
    } else {
      const errorData = await response.json();
      return { success: false, error: errorData.error };
    }
  } catch (error) {
    console.error('Progress update error:', error);
    return { success: false, error: 'Network error during progress update' };
  }
};

export const getLeaderboard = async (grade?: number) => {
  try {
    const endpoint = grade ? `/leaderboard/${grade}` : '/leaderboard';
    const response = await makeAuthenticatedRequest(endpoint);
    
    if (response.ok) {
      const data = await response.json();
      return { success: true, leaderboard: data.leaderboard };
    } else {
      const errorData = await response.json();
      return { success: false, error: errorData.error };
    }
  } catch (error) {
    console.error('Leaderboard fetch error:', error);
    return { success: false, error: 'Network error during leaderboard fetch' };
  }
};