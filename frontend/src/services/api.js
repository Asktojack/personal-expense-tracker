
import axios from 'axios';

const API = axios.create({
    baseURL: 'http://192.168.210.237:8000/api/',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add authentication token to API requests
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');

    if (token) {
        config.headers.Authorization = `Token ${token}`;
    }

    return config;
});

export default API;
