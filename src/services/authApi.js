const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const jsonHeaders = {
  'Content-Type': 'application/json',
};

const parseError = async (response) => {
  try {
    const data = await response.json();
    if (data?.message) {
      return data.message;
    }
    if (typeof data === 'object' && data !== null) {
      const firstError = Object.values(data)[0];
      if (firstError) {
        return String(firstError);
      }
    }
  } catch (error) {
    // Ignore JSON parse errors and use fallback message.
  }
  return `Request failed with status ${response.status}`;
};

const request = async (path, payload) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json();
};

export const signupUser = (payload) => request('/api/auth/signup', payload);
export const loginUser = (payload) => request('/api/auth/login', payload);
