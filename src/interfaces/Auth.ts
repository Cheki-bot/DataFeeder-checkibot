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
