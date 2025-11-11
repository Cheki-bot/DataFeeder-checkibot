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
import { QuestionsAnswers } from './pages/questions-answers/QuestionsAnswers.tsx';
import { Root } from './Root.tsx';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Root />,
        children: [
            { path: '/login', element: <LoginView /> },
            {
                path: '/',
                element: <ProtectedRoute />,
                children: [
                    { path: '/', element: <App /> },
                    { path: '/sign-up', element: <SignUpView /> },
                    { path: '/home', element: <HomeView /> },
                    { path: '/candidacies', element: <PartiesView /> },
                    { path: '/candidacies/candidates/:partyId', element: <CandidatesView /> },
                    { path: '/calendar-events', element: <CalendarEventsView /> },
                    { path: '/news_verifications', element: <VerificationCreateView /> },
                    { path: '/questions_and_answers', element: <QuestionsAnswers /> },
                ],
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
