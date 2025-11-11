import { type User } from '../../interfaces/Auth';
import {
    type RegisterFormData,
    type UserFormData,
} from '@pages/auth/schemas/userSchema';
import { login, register } from '../../services/auth.service';
import { useCallback, useMemo, useState } from 'react';
import { AuthContext } from './useAuth';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [token, setToken] = useState<string | null>(() => {
        return localStorage.getItem('token');
    });

    const isAuthenticated = useMemo(() => !!token, [token]);

    const handleLogin = useCallback(async (userData: UserFormData) => {
        try {
            const response = await login(userData);
            const accessToken = response.data.data.access_token;
            const user = response.data.data.user;

            setUser(user);
            setToken(accessToken);
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('token', accessToken);
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }, []);

    const handleRegister = useCallback(async (userData: RegisterFormData) => {
        await register(userData);
    }, []);

    const handleLogout = useCallback(() => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    }, []);

    const value = useMemo(
        () => ({
            user,
            token,
            isAuthenticated,
            login: handleLogin,
            register: handleRegister,
            logout: handleLogout,
        }),
        [user, token, isAuthenticated, handleLogin, handleRegister, handleLogout]
    );

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};
