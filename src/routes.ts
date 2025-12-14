import { createBrowserRouter } from 'react-router';
import App from './App';
import { ProjectsPage } from './pages/ProjectsPage/ProjectsPage';
import { ProjectsDetailPage } from './pages/ProjectsDetailPage/ProjectsDetailPage';

export const routes = createBrowserRouter([
  {
    path: '/',
    Component: App,
    children: [
      { index: true, Component: ProjectsPage },
      { path: 'projects/:id', Component: ProjectsDetailPage },
    ],
  },
]);
