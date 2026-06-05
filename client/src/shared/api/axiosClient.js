import axios from 'axios';
import config from '../config/env';

const axiosClient = axios.create({
    baseURL: config.vite_api_url,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

export default axiosClient;
