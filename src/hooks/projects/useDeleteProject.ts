import { useMutation, useQueryClient } from '@tanstack/react-query';
import { invalidateProjectsQueries } from '../../helpers/queryKeyHelper';
import { deleteProject } from '../../services/projects.service';

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteProject(id),
    onSuccess: () => {
      return invalidateProjectsQueries(queryClient);
    },
  });
};
