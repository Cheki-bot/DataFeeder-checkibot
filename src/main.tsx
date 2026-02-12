import {
    CalendarDetailView,
    CalendarListView,
    LoginView,
    PartiesView,
    UsersView,
    VerificationCreateView,
} from '@pages/index';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './contexts/auth-context/AuthProvider.tsx';
import './index.css';
import { Layout } from './Layout.tsx';
import CalendarEventsView from './pages/calendar-events/CalendarEventsView.tsx';
import CandidatesView from './pages/candidates/CandidatesView.tsx';
import { QuestionsAnswers } from './pages/questions-answers/QuestionsAnswers.tsx';
import { ProtectedRoute } from './ProtectedRoute.tsx';
import { Root } from './Root.tsx';
import { EmptyComponent } from './components/empty-component/EmptyComponent.tsx';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Root />,
        children: [
            { path: 'login', element: <LoginView /> },

            {
                path: '/',
                element: <ProtectedRoute />,
                children: [
                    {
                        path: '/',
                        element: <Layout />,
                        children: [
                            { index: true, element: <EmptyComponent /> },
                            { path: 'candidacies', element: <PartiesView /> },
                            {
                                path: 'candidacies/candidates/:partyName/:partyId',
                                element: <CandidatesView />,
                            },
                            {
                                path: 'calendar-events',
                                element: <CalendarEventsView />,
                            },
                            {
                                path: 'news_verifications',
                                element: <VerificationCreateView />,
                            },
                            {
                                path: 'questions_and_answers',
                                element: <QuestionsAnswers />,
                            },
                            { path: 'calendars', Component: CalendarListView },
                            // {
                            //     path: '*',
                            //     element: </>
                            // },
                            {
                                path: 'calendars/:id',
                                Component: CalendarDetailView,
                            },
                            {
                                path: 'users',
                                element: <UsersView />,
                            },
                        ],
                    },
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
