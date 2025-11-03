import {
    LoginView,
    PartiesView,
    SignUpView,
    VerificationCreateView,
} from '@pages/index';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import App from './App.tsx';
import './index.css';
import CandidatesView from './pages/candidates/CandidatesView.tsx';
import { ProtectedRoute } from './ProtectedRoute.tsx';
import { HomeView } from './pages/home/HomeView.tsx';
import { Provider } from 'react-redux';
import { store } from './lib/state/store.ts';

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
                path: '/verifications/create',
                Component: VerificationCreateView,
            },
        ],
    },
]);

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Provider store={store}>
            <RouterProvider router={router} />
        </Provider>
    </StrictMode>
);
