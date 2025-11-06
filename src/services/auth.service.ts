import { api } from './api.service';
import type { RegisterFormData, UserFormData } from '@pages/auth/schemas/userSchema';

export const login = async (userData: UserFormData) => {
    const data = await api.post('/auth/login', userData);
    return data;
};

export const register = async (userData: RegisterFormData) => {
    const { data } = await api.post('/auth/register', userData);
    return data;
};
