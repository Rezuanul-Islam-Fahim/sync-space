import axiosClient from '@/shared/api/axiosClient';

const authService = {
    register: async userData => {
        return await axiosClient.post('/auth/register', userData);
    },
};

export default authService;
