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
import { HeaderComponent } from './components/header-component/HeaderComponent.tsx';
import { QuestionsAnswers } from './pages/questions-answers/QuestionsAnswers.tsx';

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
                path: '/candidacies',
                Component: PartiesView,
            },
            {
                path: '/candidacies/candidates/:partyId',
                Component: CandidatesView,
            },
            {
                path: '/calendars',
            },
            {
                path: '/news_verifications',
                Component: VerificationCreateView,
            },
            {
                path: '/questions_and_answers',
                Component: QuestionsAnswers,
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
            <HeaderComponent type='logged'/>
            <RouterProvider router={router} />
        </AuthProvider>
    </StrictMode>
);
