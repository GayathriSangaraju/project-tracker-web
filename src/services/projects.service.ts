import { CreateProjectDTO, Project, UpdateProjectDTO } from '../types/project';
import { fetchApi } from './fetchHelper';

export const getAllProjects = async (): Promise<Project[]> => {
  return fetchApi('/projects');
};

export const getProjectById = async (id: string): Promise<Project> => {
  return fetchApi(`/projects/${id}`);
};

export const createProject = async (project: CreateProjectDTO): Promise<Project> => {
  return fetchApi('/projects', {
    method: 'POST',
    body: JSON.stringify(project),
  });
};

export const updateProject = async (
  id: string,
  updatedProject: UpdateProjectDTO,
): Promise<Project> => {
  return fetchApi(`/projects/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updatedProject),
  });
};

export const deleteProject = async (id: string) => {
  return fetchApi(`/projects/${id}`, {
    method: 'DELETE',
  });
};
