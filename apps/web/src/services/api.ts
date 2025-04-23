import axios from 'axios';
import { Alert } from '@paynless/types/alert'; 

const API_URL = import.meta.env['VITE_API_URL'] || 'http://localhost:3000/api';



const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  getInventory: async (filters = {}) => {
    const response = await api.get('/inventory', { params: filters });
    return response.data;
  },

  getSummary: async () => {
    const response = await api.get('/summary');
    return response.data;
  },

  getAlerts: async (limit = 50) => {
    const response = await api.get('/alerts', { params: { limit } });
    return response.data;
  },

  getForecasts: async (limit = 100) => {
    const response = await api.get('/forecasts', { params: { limit } });
    return response.data;
  },

  getEvents: async (limit = 100) => {
    const response = await api.get('/events', { params: { limit } });
    return response.data;
  },

  runForecast: async (params = {}) => {
    const response = await api.post('/forecast/run', params);
    return response.data;
  },

  generateAlertSummary: async (alerts: Alert[]): Promise<string> => {
    const response = await api.post('/alerts/summary', { alerts });
    return response.data.summary;
  },
};
