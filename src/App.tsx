import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Outlet } from 'react-router';
import { ErrorBoundary } from 'react-error-boundary';
import { ModalContextProvider } from './contexts/ModalContextProvider';
import { ErrorMessage } from './components/ErrorMessage/ErrorMessage';

export default function App() {
  return (
    <ModalContextProvider>
      <Box component="main" sx={{ p: '2rem', fontFamily: 'system-ui, sans-serif' }}>
        <Box component="header" sx={{ mb: 2 }}>
          <Typography variant="h4" component="h1" sx={{ textAlign: 'center' }}>
            Project Tracker
          </Typography>
        </Box>
        <ErrorBoundary
          fallback={<ErrorMessage message="Something went wrong on this page." />}
        >
          <Outlet />
        </ErrorBoundary>
      </Box>
    </ModalContextProvider>
  );
}
