import { Task } from './task';

export type BaseProject = {
  name: string;
};

export type CreateProjectDTO = BaseProject;

export type UpdateProjectDTO = BaseProject;

export type Project = {
  id: string;
  name: string;
  tasks: Task[];
  created_at: string; // ISO timestamp
};
