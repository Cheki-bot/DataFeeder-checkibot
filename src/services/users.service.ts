import type { CreateUserData, UpdateUserData, UsersResponse, UserResponse, BaseUserResponse } from '@/interfaces/User';
import { api } from './api.service';

export const getUsers = async (): Promise<UsersResponse> => {
    const response = await api.get<UsersResponse>('/users');
    return response.data;
};

export const createUser = async (userData: CreateUserData): Promise<UserResponse> => {
    const response = await api.post<UserResponse>('/users', userData);
    return response.data;
};

export const updateUser = async (id: string, userData: UpdateUserData): Promise<UserResponse> => {
    const response = await api.patch<UserResponse>(`/users/${id}`, userData);
    return response.data;
};

export const deleteUser = async (id: string): Promise<BaseUserResponse> => {
    const response = await api.delete<BaseUserResponse>(`/users/${id}`);
    return response.data;
};

export const activateUser = async (id: string): Promise<BaseUserResponse> => {
    const response = await api.patch<BaseUserResponse>(`/users/${id}/activate`);
    return response.data;
};

export const deactivateUser = async (id: string): Promise<BaseUserResponse> => {
    const response = await api.patch<BaseUserResponse>(`/users/${id}/deactivate`);
    return response.data;
};
