import { Outlet } from 'react-router';
import { ModalContextProvider } from './contexts/ModalContextProvider';

export default function App() {
  return (
    <ModalContextProvider>
      <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
        <h1 style={{ textAlign: 'center' }}>Project Tracker</h1>
        <Outlet />
      </div>
    </ModalContextProvider>
  );
}
