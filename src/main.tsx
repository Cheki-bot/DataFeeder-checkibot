import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import './index.css'
import App from './App.tsx'
import { ProtectedRoute } from './ProtectedRoute.tsx'
import { LoginView, SignUpView } from '@pages'

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
        Component: SignUpView
      }
    ]
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
