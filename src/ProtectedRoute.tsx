import { Navigate, Outlet } from "react-router";

export const ProtectedRoute = () => {
    const isAuthenticated = true;

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}