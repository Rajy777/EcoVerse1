// API Configuration for EcoVerse Frontend
export const API_CONFIG = {
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000',
  endpoints: {
    health: '/api/health',
    cities: '/api/cities',
    citiesFilter: '/api/cities/filter',
    citiesSearch: '/api/cities/search',
    cityDetails: (cityName: string) => `/api/cities/${cityName}`,
    cityHistorical: (cityName: string, parameter: string) => `/api/cities/${cityName}/historical/${parameter}`,
    dashboard: '/api/environmental/dashboard',
    aiChat: '/api/ai/chat',
    zonesCities: '/api/zones/cities',
    zonesCity: (cityName: string) => `/api/zones/city/${cityName}`,
    analysisCity: (cityName: string) => `/api/analysis/city/${cityName}`,
    analysisHotspots: (cityName: string) => `/api/analysis/hotspots/${cityName}`,
    analysisParks: (cityName: string) => `/api/analysis/parks/${cityName}`,
    analysisClinics: (cityName: string) => `/api/analysis/clinics/${cityName}`,
    analysisOverview: '/api/analysis/overview'
  }
};

// Helper function to get full API URL
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.baseURL}${endpoint}`;
};

// Helper function for API calls with error handling
export const apiCall = async (url: string, options?: RequestInit) => {
  try {
    const response = await fetch(getApiUrl(url), {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
};