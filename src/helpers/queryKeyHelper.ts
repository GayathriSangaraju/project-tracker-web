import { QueryClient } from '@tanstack/react-query';

const PROJECTS_QUERY_KEY = 'projects';
const TASKS_QUERY_KEY = 'tasks';

export const getAllProjectsQueryKey = () => [PROJECTS_QUERY_KEY];

export const getProjectByIdQueryKey = (id: string) => [PROJECTS_QUERY_KEY, id];

export const invalidateProjectsQueries = (queryClient: QueryClient) => {
  return queryClient.invalidateQueries({ queryKey: getAllProjectsQueryKey() });
};

export const getTasksByIdQueryKey = (projectId: string, taskId: string) => {
  return [PROJECTS_QUERY_KEY, projectId, TASKS_QUERY_KEY, taskId];
};

export const getAllTasksByProjectIdQueryKey = (projectId: string) => {
  return [PROJECTS_QUERY_KEY, projectId, TASKS_QUERY_KEY];
};

export const invalidateTasksByProjectIdQueries = (queryClient: QueryClient, projectId: string) => {
  return queryClient.invalidateQueries({ queryKey: getAllTasksByProjectIdQueryKey(projectId) });
};
