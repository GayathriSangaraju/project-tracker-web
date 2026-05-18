import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router';
import { routes } from './routes';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorMessage } from './components/ErrorMessage/ErrorMessage';
import { GENERIC_ERROR_MESSAGE } from './constants/errorMessages';
import { queryClient } from './queryClient';

const AppWrapper = () => (
  <ErrorBoundary fallback={<ErrorMessage message={GENERIC_ERROR_MESSAGE} />}>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={routes} />
    </QueryClientProvider>
  </ErrorBoundary>
);

const root = createRoot(document.getElementById('root')!);
root.render(<AppWrapper />);
