import { useMutation, useQueryClient } from '@tanstack/react-query';
import { invalidateTasksByProjectIdQueries } from '../../helpers/queryKeyHelper';
import { deleteTask } from '../../services/tasks.service';

export const useDeleteTask = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (taskId: string) => deleteTask(projectId, taskId),
    onSuccess: () => {
      return invalidateTasksByProjectIdQueries(queryClient, projectId);
    },
  });
};
