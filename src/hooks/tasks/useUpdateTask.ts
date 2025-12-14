import { useMutation, useQueryClient } from '@tanstack/react-query';
import { invalidateTasksByProjectIdQueries } from '../../helpers/queryKeyHelper';
import { UpdateTaskDTO } from '../../types/task';
import { updateTask } from '../../services/tasks.service';

interface UpdateTaskParams {
  taskId: string;
  updateTaskData: UpdateTaskDTO;
}

export const useUpdateTask = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, updateTaskData }: UpdateTaskParams) =>
      updateTask(projectId, taskId, updateTaskData),
    onSuccess: () => {
      return invalidateTasksByProjectIdQueries(queryClient, projectId);
    },
  });
};
