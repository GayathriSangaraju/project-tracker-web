import { fetchApi } from './fetchHelper';
import { CreateTaskDTO, Task, UpdateTaskDTO } from '../types/task';

export const getAllTasksByProjectId = async (projectId: string): Promise<Task[]> => {
  return fetchApi(`/projects/${projectId}/tasks`);
};

export const getProjectTaskById = async (projectId: string, taskId: string): Promise<Task> => {
  return fetchApi(`/projects/${projectId}/tasks/${taskId}`);
};

export const createTask = async (projectId: string, task: CreateTaskDTO): Promise<Task> => {
  return fetchApi(`/projects/${projectId}/tasks`, {
    method: 'POST',
    body: JSON.stringify(task),
  });
};

export const updateTask = async (
  projectId: string,
  taskId: string,
  task: UpdateTaskDTO,
): Promise<Task> => {
  return fetchApi(`/projects/${projectId}/tasks/${taskId}`, {
    method: 'PATCH',
    body: JSON.stringify(task),
  });
};

export const deleteTask = async (projectId: string, taskId: string) => {
  return fetchApi(`/projects/${projectId}/tasks/${taskId}`, {
    method: 'DELETE',
  });
};
