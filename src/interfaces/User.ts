export interface IUser {
    _id: string;
    email: string;
    username: string;
    role: 'admin' | 'employee';
    is_active: boolean;
    created_at: string;
    updated_at: string;
    promoted_by?: string;
}

export interface CreateUserData {
    username: string;
    email: string;
    role: 'admin' | 'employee';
    is_active: boolean;
    password: string;
}

export interface UpdateUserData {
    username?: string;
    email?: string;
    role?: 'admin' | 'employee';
    is_active?: boolean;
    password?: string;
}

export interface UsersResponse {
    message: string;
    ok: boolean;
    status: number;
    data: IUser[];
}

export interface UserResponse {
    message: string;
    ok: boolean;
    status: number;
    data: IUser;
}

export interface BaseUserResponse {
    message: string;
    ok: boolean;
    status: number;
}
