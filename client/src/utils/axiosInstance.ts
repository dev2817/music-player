import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL;

const axiosInstance = axios.create({
    baseURL: baseUrl,
    timeout: 10000,
});

axiosInstance.interceptors.response.use(
    (response) => {
        if (response.status === 401 || response.data.signOut && response.data.success === false) {
            localStorage.clear();
            const navigate = useNavigate();
            navigate('/sign-in');
            window.location.reload();
        }
        return response;
    },
    (error) => {
        if (error.status === 401 || error.data.signOut && error.data.success === false) {
            localStorage.clear();
            window.location.replace('/sign-in');
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
