import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Outlet } from 'react-router';
import { ErrorBoundary } from 'react-error-boundary';
import { ModalContextProvider } from './contexts/ModalContextProvider';
import { ErrorMessage } from './components/ErrorMessage/ErrorMessage';

export default function App() {
  return (
    <ModalContextProvider>
      <Box sx={{ p: '2rem', fontFamily: 'system-ui, sans-serif' }}>
        <Typography variant="h4" component="h1" sx={{ textAlign: 'center', mb: 2 }}>
          Project Tracker
        </Typography>
        <ErrorBoundary
          fallback={<ErrorMessage message="Something went wrong on this page." />}
        >
          <Outlet />
        </ErrorBoundary>
      </Box>
    </ModalContextProvider>
  );
}
