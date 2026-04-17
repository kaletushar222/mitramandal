import axios from 'axios';

export function createApiClient(basePath) {
  const base = (process.env.REACT_APP_API_ENDPOINT || '') + basePath;
  const client = axios.create({
    baseURL: base,
    timeout: 31000,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  // Attach JWT from localStorage (if present) to every request
  client.interceptors.request.use(
    (config) => {
      try {
        const u = localStorage.getItem('mitramandal_user');
        const user = u ? JSON.parse(u) : null;
        if (user && user.token) {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      } catch (e) {
        // ignore
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  return client;
}
