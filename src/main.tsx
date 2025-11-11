import {
    LoginView,
    PartiesView,
    SignUpView,
    VerificationCreateView,
} from '@pages/index';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.tsx';
import { AuthProvider } from './contexts/auth-context/AuthProvider.tsx';
import './index.css';
import CandidatesView from './pages/candidates/CandidatesView.tsx';
import { ProtectedRoute } from './ProtectedRoute.tsx';
import { HomeView } from './pages/home/HomeView.tsx';
import CalendarEventsView from './pages/calendar-events/CalendarEventsView.tsx';

const router = createBrowserRouter([
    {
        path: '/login',
        Component: LoginView,
    },
    {
        path: '/',
        Component: ProtectedRoute,
        children: [
            {
                path: '/',
                Component: App,
            },
            {
                path: '/sign-up',
                Component: SignUpView,
            },
            {
                path: '/home',
                Component: HomeView,
            },
            {
                path: '/parties',
                Component: PartiesView,
            },
            {
                path: '/parties/candidates',
                Component: CandidatesView,
            },
            {
                path: '/verifications',
                Component: VerificationCreateView,
            },
            {
                path: '/calendar-events',
                Component: CalendarEventsView,
            },
        ],
    },
]);

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <AuthProvider>
            <RouterProvider router={router} />
        </AuthProvider>
    </StrictMode>
);
