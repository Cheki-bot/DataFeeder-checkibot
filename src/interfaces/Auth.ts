export interface AuthResponse {
    message: string;
    ok: boolean;
    status: number;
    data: Data;
}

export interface Data {
    token: string;
    user: User;
}

export interface User {
    email: string;
    name: string;
    role: string;
    is_active: boolean;
    failed_attempts: number;
    lockout_until: Date;
    created_at: Date;
    updated_at: Date;
}

export interface ProfileData {
    email: string;
    name: string;
    role: string;
    is_active: boolean;
    failed_attempts: number;
    lockout_until: string | null;
    created_at: string;
    updated_at: string;
}

export interface ProfileResponse {
    message: string;
    ok: boolean;
    status: number;
    data: ProfileData;
}

export interface ChangePasswordPayload {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}
