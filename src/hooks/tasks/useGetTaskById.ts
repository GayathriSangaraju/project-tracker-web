import { useQuery } from '@tanstack/react-query';
import { getTasksByIdQueryKey } from '../../helpers/queryKeyHelper';
import { getProjectTaskById } from '../../services/tasks.service';

export const useGetTaskById = (projectId: string, taskId: string) => {
  return useQuery({
    queryKey: getTasksByIdQueryKey(projectId, taskId),
    queryFn: async () => await getProjectTaskById(projectId, taskId),
    enabled: !!projectId && !!taskId,
  });
};
