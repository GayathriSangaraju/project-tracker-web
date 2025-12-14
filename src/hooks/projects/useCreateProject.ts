import { createProject } from '../../services/projects.service';
import { CreateProjectDTO } from '../../types/project';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { invalidateProjectsQueries } from '../../helpers/queryKeyHelper';

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (project: CreateProjectDTO) => createProject(project),
    onSuccess: () => {
      return invalidateProjectsQueries(queryClient);
    },
  });
};
