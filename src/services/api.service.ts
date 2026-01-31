import axios from 'axios';
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        try {
            const token = localStorage.getItem('token');
            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.warn('Error accessing localStorage:', error);
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);
