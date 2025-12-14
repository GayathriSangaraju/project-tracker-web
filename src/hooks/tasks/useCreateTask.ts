import { useMutation, useQueryClient } from '@tanstack/react-query';
import { invalidateTasksByProjectIdQueries } from '../../helpers/queryKeyHelper';
import { createTask } from '../../services/tasks.service';
import { CreateTaskDTO } from '../../types/task';

export const useCreateTask = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (task: CreateTaskDTO) => createTask(projectId, task),
    onSuccess: () => {
      return invalidateTasksByProjectIdQueries(queryClient, projectId);
    },
  });
};
