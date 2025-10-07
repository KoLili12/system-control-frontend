import axiosClient from './axiosClient';

export const authApi = {
  // POST /api/v1/auth/login
  login: async (email, password) => {
    const response = await axiosClient.post('/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  // POST /api/v1/auth/register
  register: async (userData) => {
    const response = await axiosClient.post('/auth/register', {
      email: userData.email,
      password: userData.password,
      first_name: userData.firstName,
      last_name: userData.lastName,
      phone: userData.phone,
      role_code: userData.roleCode,
    });
    return response.data;
  },

  // GET /api/v1/profile
  getProfile: async () => {
    const response = await axiosClient.get('/profile');
    return response.data;
  },
};