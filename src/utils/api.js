export const API_URL = 'http://127.0.0.1:8000/api';

export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  try {
    return user ? JSON.parse(user) : null;
  } catch (e) {
    return null;
  }
};

export const setCurrentUser = (user) => {
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
  } else {
    localStorage.removeItem('user');
  }
};

export const fetchApi = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const defaultHeaders = {
    'Accept': 'application/json',
  };

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  let body = options.body;
  if (body && typeof body === 'object' && !(body instanceof FormData) && !(body instanceof URLSearchParams)) {
    body = JSON.stringify(body);
    defaultHeaders['Content-Type'] = 'application/json';
  } else if (body && typeof body === 'string') {
    // If string is passed and no content-type is set, default to application/json
    if (!options.headers?.['Content-Type']) {
      defaultHeaders['Content-Type'] = 'application/json';
    }
  }

  const config = {
    ...options,
    body,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    signal: controller.signal,
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('auth-expired'));
      }
      const errorData = await response.json().catch(() => ({}));
      let msg = errorData.message || `API Error: ${response.status}`;
      if (errorData.errors) {
        const validationDetails = Object.values(errorData.errors).flat().join(' ');
        if (validationDetails) {
          msg = `${msg}: ${validationDetails}`;
        }
      }
      throw new Error(msg);
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return null;
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Network timeout: The Laravel API took too long to respond.');
    }
    throw error;
  }
};
