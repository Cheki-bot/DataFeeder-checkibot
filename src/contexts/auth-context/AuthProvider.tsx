import { type User } from '../../interfaces/Auth';
import {
    type RegisterFormData,
    type UserFormData,
} from '@pages/auth/schemas/userSchema';
import { login, register } from '../../services/auth.service';
import { useCallback, useMemo, useState, useEffect } from 'react';
import { AuthContext } from './useAuth';

interface JWTPayload {
    exp: number;
    iat: number;
    sub?: string;
    role?: string;
    // Agrega aquí cualquier otro claim que tu backend incluya
    [key: string]: unknown;
}

// Función auxiliar para decodificar JWT sin depender de librerías externas
const decodeToken = (token: string): JWTPayload | null => {
    try {
        const payload = token.split('.')[1];
        return JSON.parse(atob(payload));
    } catch {
        return null;
    }
};

// Verifica si el token está expirado (comparando con tiempo actual en segundos)
const isTokenExpired = (token: string | null): boolean => {
    if (!token) return true;

    const payload = decodeToken(token);
    if (!payload || !payload.exp) return true;

    const currentTime = Date.now() / 1000; // segundos
    return payload.exp < currentTime;
};

// Limpia almacenamiento si el token es inválido o expirado
const clearAuthStorage = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);

    // Cargar y validar token/user al montar el componente
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            if (isTokenExpired(storedToken)) {
                // Token expirado → limpiar todo
                console.warn('Token expirado, cerrando sesión automáticamente');
                clearAuthStorage();
                setUser(null);
                setToken(null);
            } else {
                // Token válido
                setToken(storedToken);
                try {
                    setUser(JSON.parse(storedUser));
                } catch {
                    clearAuthStorage();
                    setUser(null);
                    setToken(null);
                }
            }
        }
    }, []);

    // isAuthenticated ahora considera validez real del token
    const isAuthenticated = useMemo(() => {
        return !!token && !isTokenExpired(token);
    }, [token]);

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
            console.error('Error en login:', error);
            return false;
        }
    }, []);

    const handleRegister = useCallback(async (userData: RegisterFormData) => {
        await register(userData);
    }, []);

    const handleLogout = useCallback(() => {
        setUser(null);
        setToken(null);
        clearAuthStorage();
    }, []);

    // Opcional: verificar expiración periódicamente (cada minuto)
    useEffect(() => {
        if (!token) return;

        const checkToken = () => {
            if (isTokenExpired(token)) {
                console.warn('Token expirado durante sesión activa');
                handleLogout();
            }
        };

        const interval = setInterval(checkToken, 60_000); // cada minuto
        return () => clearInterval(interval);
    }, [token, handleLogout]);

    const value = useMemo(
        () => ({
            user,
            token,
            isAuthenticated,
            login: handleLogin,
            register: handleRegister,
            logout: handleLogout,
        }),
        [
            user,
            token,
            isAuthenticated,
            handleLogin,
            handleRegister,
            handleLogout,
        ]
    );

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};
