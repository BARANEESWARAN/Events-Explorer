
import axios from 'axios';

const TICKETMASTER_API_KEY = import.meta.env.VITE_TICKETMASTER_API_KEY;
const TICKETMASTER_BASE_URL = 'https://app.ticketmaster.com/discovery/v2';

export const ticketmasterApi = axios.create({
  baseURL: TICKETMASTER_BASE_URL,
  params: {
    apikey: TICKETMASTER_API_KEY,
  }
});

ticketmasterApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);
