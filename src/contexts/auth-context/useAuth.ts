import { createContext, useContext } from 'react';
import { type User } from '../../interfaces/Auth';
import {
    type UserFormData,
    type RegisterFormData,
} from '@pages/auth/schemas/userSchema';

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (userData: UserFormData) => Promise<boolean>;
    register: (userData: RegisterFormData) => Promise<void>;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
