import axiosClient from '@/shared/api/axiosClient';
import { API_ENDPOINTS } from '@/shared/config';

const authService = {
  register: async userData => {
    return await axiosClient.post(API_ENDPOINTS.AUTH.REGISTER, userData);
  },
};

export default authService;
