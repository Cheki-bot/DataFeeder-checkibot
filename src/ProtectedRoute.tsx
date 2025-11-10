import { Navigate, Outlet } from "react-router";
import { useAuth } from "./contexts/auth-context/useAuth";

export const ProtectedRoute = () => {
    const { isAuthenticated } = useAuth();

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}