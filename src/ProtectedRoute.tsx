import { Navigate, Outlet } from "react-router";

export const ProtectedRoute = () => {
    const isAuthenticated = false;

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}