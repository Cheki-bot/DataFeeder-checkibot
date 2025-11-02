import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import './index.css';
import App from './App.tsx';
import { ProtectedRoute } from './ProtectedRoute.tsx';
import {
    PartiesView,
    LoginView,
    SignUpView,
    VerificationCreateView,
} from '@pages/index';
import CandidatesView from './pages/candidates/CandidatesView.tsx';

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
                path: '/parties',
                Component: PartiesView,
            },
            {
                path: '/parties/candidates',
                Component: CandidatesView,
            },
            {
                path: '/verifications/create',
                Component: VerificationCreateView,
            },
        ],
    },
]);

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>
);
