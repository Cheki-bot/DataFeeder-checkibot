import {
  LoginView,
  PartiesView,
  SignUpView,
  VerificationCreateView,
  CalendarListView,
  CalendarDetailView,
  CalendarCreateView,
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
                path: '/calendars',
                Component: CalendarListView,
            },
            {
                path: '/calendars/:id',
                Component: CalendarDetailView,
            },
            {
                path: '/calendars/create',
                Component: CalendarCreateView,
            },
        ],
    },
]);

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>
);
