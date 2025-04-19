import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

export async function sendRequest({ method, route, data, includeHeaders = false }) {
  try {
    const config = {
      method,
      url: `${API_URL}${route}`,
      data,
      withCredentials: includeHeaders,
      headers: includeHeaders ? { 'Content-Type': 'application/json' } : {},
    };
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}
