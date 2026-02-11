import { api } from './api.service';
import type {
    ChangePasswordPayload,
    ProfileResponse,
} from '@/interfaces/Auth';
import type {
    RegisterFormData,
    UserFormData,
} from '@pages/auth/schemas/userSchema';

export const login = async (userData: UserFormData) => {
    const data = await api.post('/auth/login', userData);
    return data;
};

export const register = async (userData: RegisterFormData) => {
    const { data } = await api.post('/auth/register', userData);
    return data;
};

export const getProfile = async () => {
    const response = await api.get<ProfileResponse>('/auth/me');
    return response.data;
};

export const changePassword = async (payload: ChangePasswordPayload) => {
    const response = await api.patch('/auth/me/change-password', payload);
    return response.data;
};
