# Datafeeder-Checkibot Project Guide

## Project Overview

**Datafeeder-Checkibot** is a React-based electoral verification and management system designed for tracking political candidates, verifications, and electoral calendar events. The application provides tools for managing candidate information, creating verifications, and organizing electoral calendar data.

### Key Technologies

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 7
- **Routing**: React Router 7
- **State Management**: React Context API
- **Form Handling**: React Hook Form with Zod validation
- **HTTP Client**: Axios
- **Excel Processing**: SheetJS (xlsx)
- **Styling**: CSS Modules
- **Code Quality**: ESLint, Prettier, TypeScript

### High-Level Architecture

The application follows a component-based architecture with:

- **Pages**: Feature-specific views (auth, verifications, candidates, calendars, etc.)
- **Components**: Reusable UI components (buttons, inputs, lists, modals)
- **Services**: API service layer for backend communication
- **Context**: Authentication state management
- **Hooks**: Custom hooks for common functionality (Excel, notifications, forms)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git (for version control)
- Modern web browser

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd datafeeder-checkibot
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:

```bash
cp .env.example .env
```

Edit `.env` and set your API URL:

```
VITE_API_URL=http://your-api-url.com
```

4. Start the development server:

```bash
npm run dev
```

5. Build for production:

```bash
npm run build
```

6. Preview production build:

```bash
npm run preview
```

### Basic Usage

- **Login**: Navigate to `/login` and authenticate with your credentials
- **Create Verification**: Go to `/news_verifications` and use the form or upload Excel files
- **Manage Candidates**: Access candidate details from `/candidacies/candidates/:partyName/:partyId`
- **Calendar Events**: View and manage electoral calendar events at `/calendar-events`

### Running Tests

```bash
npm run lint  # Run ESLint
npm run format  # Format code with Prettier
```

## Project Structure

```
datafeeder-checkibot/
├── public/                    # Static assets
│   └── Logo_ChequeaBolivia.png
├── src/
│   ├── components/            # Reusable UI components
│   │   ├── add-button-component/
│   │   ├── button-component/
│   │   ├── card-component/
│   │   ├── event-form/
│   │   ├── header-component/
│   │   ├── input-component/
│   │   ├── input-tags-component/
│   │   ├── list-component/
│   │   ├── modal-component/
│   │   ├── notification-component/
│   │   ├── notification-container/
│   │   ├── search-component/
│   │   └── index.ts
│   ├── contexts/               # React Context providers
│   │   └── auth-context/
│   │       ├── AuthProvider.tsx
│   │       └── useAuth.ts
│   ├── hooks/                   # Custom React hooks
│   │   ├── useCalendarForm.ts
│   │   ├── useEventForm.ts
│   │   ├── useExcel.ts
│   │   ├── useNotification.ts
│   │   └── useSearch.ts
│   ├── interfaces/             # TypeScript interfaces
│   │   ├── Auth.ts
│   │   ├── Candidacies.ts
│   │   ├── Calendar.ts
│   │   ├── Notification.ts
│   │   ├── QA.interface.ts
│   │   └── Verification.ts
│   ├── lib/                    # Utility libraries
│   │   └── shared/ui/
│   │       └── custom-checkbox.tsx
│   ├── pages/                   # Feature pages
│   │   ├── auth/
│   │   │   ├── login-view/
│   │   │   └── register-view/
│   │   ├── calendar-events/
│   │   │   └── schemas/
│   │   │       └── calendarEventSchema.ts
│   │   ├── calendars/
│   │   │   ├── detail-view/
│   │   │   └── list-view/
│   │   ├── candidates/
│   │   │   ├── schemas/
│   │   │   │   └── candidatesSchema.ts
│   │   │   └── service/
│   │   ├── questions-answers/
│   │   │   ├── schemas/
│   │   │   │   └── questions-answers.ts
│   │   │   └── service/
│   │   ├── verifications/
│   │   │   ├── schemas/
│   │   │   │   └── verificationSchema.ts
│   │   │   ├── service/
│   │   │   │   └── verifications.service.ts
│   │   │   └── utils/
│   │   │       └── normalize-text.ts
│   │   ├── home/
│   │   │   └── SideBar.tsx
│   │   └── index.ts
│   ├── services/               # API service layer
│   │   ├── api.service.ts
│   │   ├── auth.service.ts
│   │   ├── candidates.service.ts
│   │   ├── categories.service.ts
│   │   └── calendar.service.ts
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   ├── Layout.tsx
│   ├── Root.tsx
│   └── ProtectedRoute.tsx
├── .env.example
├── .gitignore
├── .prettierrc
├── eslint.config.js
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
└── vite.config.ts
```

### Key Files

- **`src/main.tsx`**: Application entry point, sets up React Router and AuthProvider
- **`src/App.tsx`**: Root component with Sidebar
- **`src/Layout.tsx`**: Main layout with Header and Sidebar
- **`src/Root.tsx`**: Router outlet component
- **`src/ProtectedRoute.tsx`**: Route guard for authenticated pages
- **`src/contexts/auth-context/AuthProvider.tsx`**: Authentication state management
- **`src/services/api.service.ts`**: Axios instance with interceptors
- **`vite.config.ts`**: Vite configuration with path aliases

## Development Workflow

### Coding Standards

- **TypeScript**: Strict type checking enabled
- **ESLint**: Enforces React and TypeScript best practices
- **Prettier**: Code formatting with `.prettierrc` configuration
- **Component Naming**: PascalCase for components, camelCase for functions
- **File Naming**: PascalCase for TSX files, camelCase for TS files

### Testing Approach

The project uses:

- **ESLint** for code quality and linting
- **Prettier** for consistent code formatting
- **TypeScript** for compile-time error detection

Manual testing is performed for:

- User flows and interactions
- Form validation
- Excel file processing
- API integration

### Build and Deployment

1. **Development**: `npm run dev` (Vite dev server with HMR)
2. **Production Build**: `npm run build` (TypeScript compilation + Vite bundling)
3. **Preview**: `npm run preview` (Production build preview)

### Contribution Guidelines

1. Create a feature branch from `main`
2. Make your changes with proper TypeScript types
3. Run `npm run lint` to check for issues
4. Run `npm run format` to format your code
5. Test your changes locally
6. Submit a pull request with clear description

## Key Concepts

### Domain Terminology

- **Verification**: Political content verification record with title, summary, body, classification, and tags
- **Candidate**: Political candidate with full name, position, and party affiliation
- **Party**: Political party with candidates
- **Electoral Calendar**: Timeline of electoral events and activities
- **Tag**: Metadata with name and URL for verifications
- **Section URL**: URL of the section where verification was published
- **Source URL**: URL of the original source

### Core Abstractions

- **AuthProvider**: Manages authentication state, token validation, and user session
- **ApiService**: Centralized HTTP client with automatic token injection
- **Form Components**: Reusable form inputs with validation
- **ListComponent**: Generic list component with search and selection
- **ModalComponent**: Reusable modal for confirmations and forms

### Design Patterns

- **Container/Presentational Pattern**: Components separated into container (logic) and presentational (UI) layers
- **Service Layer**: API calls isolated in service modules
- **Context API**: Global state management for authentication
- **Custom Hooks**: Reusable logic extracted into hooks
- **Zod Schemas**: Type-safe form validation
- **Path Aliases**: `@/` for src, `@components/`, `@pages/`, etc.

## Common Tasks

### Creating a New Page

1. Create the page component in `src/pages/`
2. Create corresponding service in `src/services/`
3. Add route to `src/main.tsx` in the router configuration
4. Export from `src/pages/index.ts`
5. Add CSS module in `src/pages/`

Example:

```typescript
// src/pages/my-page/MyPage.tsx
import { api } from '@/services/api.service';

export const MyPage = () => {
  // Component logic
  return <div>My Page</div>;
};

// src/pages/index.ts
export * from './my-page/MyPage';
```

### Adding a New API Endpoint

1. Create service function in `src/services/`
2. Use the `api` instance for requests
3. Handle errors appropriately

Example:

```typescript
// src/services/my-service.ts
import { api } from './api.service';

export const getMyData = async () => {
    const response = await api.get('/my-endpoint');
    return response.data;
};
```

### Creating a Reusable Component

1. Create component in `src/components/`
2. Create CSS module in `src/components/`
3. Export from `src/components/index.ts`
4. Use TypeScript interfaces for props

Example:

```typescript
// src/components/my-component/MyComponent.tsx
import style from './MyComponent.module.css';

interface MyComponentProps {
  title: string;
  onClick?: () => void;
}

export const MyComponent = ({ title, onClick }: MyComponentProps) => {
  return <div className={style.container}>{title}</div>;
};
```

### Adding Form Validation

1. Create Zod schema in `src/pages/*/schemas/`
2. Use `react-hook-form` with `zodResolver`
3. Add error handling

Example:

```typescript
// src/pages/my-page/schemas/mySchema.ts
import { z } from 'zod';

export const mySchema = z.object({
    name: z.string().min(3, 'Name is required'),
    email: z.string().email('Invalid email'),
});

export type MyFormData = z.infer<typeof mySchema>;
```

### Processing Excel Files

1. Use `useExcel` hook for Excel processing
2. Define expected columns mapping
3. Handle file upload and data transformation

Example:

```typescript
import { useExcel } from '@/hooks/useExcel';

const columns = {
    title: 'Titulo',
    summary: 'Resumen',
    // ... other columns
};

const { data, message } = useExcel(sheet.sheet, columns);
```

### Authentication Flow

1. User logs in via `/login`
2. Token stored in localStorage
3. AuthProvider validates token on mount
4. Protected routes check `isAuthenticated` state
5. Token expiration checked every minute

## Troubleshooting

### Common Issues

**Issue**: "Module not found" errors

- **Solution**: Ensure all imports use path aliases (`@/` instead of `./` or `../`)

**Issue**: TypeScript errors in components

- **Solution**: Check that all components have proper TypeScript interfaces and types

**Issue**: API calls failing

- **Solution**: Verify `.env` file has correct `VITE_API_URL` set

**Issue**: Token expiration

- **Solution**: AuthProvider automatically clears expired tokens and logs out

**Issue**: Excel file not processing

- **Solution**: Ensure Excel has required columns matching the schema

### Debugging Tips

1. **React DevTools**: Use React DevTools to inspect component state and props
2. **Console Logs**: Check browser console for API errors and validation messages
3. **Network Tab**: Inspect API requests and responses in browser DevTools
4. **TypeScript**: Use TypeScript compiler to catch type errors during development
5. **Vite HMR**: Changes should hot-reload automatically in development

### Environment Variables

- `VITE_API_URL`: Base URL for the backend API (required)
- Other environment variables should be added to `.env` file

## References

- [React Documentation](https://react.dev/)
- [React Router Documentation](https://reactrouter.com/)
- [Vite Documentation](https://vitejs.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Zod Documentation](https://zod.dev/)
- [React Hook Form](https://react-hook-form.com/)
- [Axios Documentation](https://axios-http.com/)

## Additional Resources

- **Continue**: This guide is automatically loaded into Continue context
- **Local Development**: Run `npm run dev` to start development server
- **Code Style**: Follow ESLint and Prettier configurations
- **Type Safety**: Leverage TypeScript for type safety throughout the codebase
