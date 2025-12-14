import { updateProject } from '../../services/projects.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { invalidateProjectsQueries } from '../../helpers/queryKeyHelper';
import { UpdateProjectDTO } from '../../types/project';

export const useUpdateProject = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (project: UpdateProjectDTO) => updateProject(id, project),
    onSuccess: () => {
      return invalidateProjectsQueries(queryClient);
    },
  });
};
