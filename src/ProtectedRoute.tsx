import { Navigate, Outlet } from "react-router";
import { useAuth } from "./contexts/auth-context/useAuth";

export const ProtectedRoute = () => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) return null;

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}