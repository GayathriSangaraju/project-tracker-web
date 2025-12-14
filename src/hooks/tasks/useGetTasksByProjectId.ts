import { useQuery } from '@tanstack/react-query';
import { getAllTasksByProjectIdQueryKey } from '../../helpers/queryKeyHelper';
import { getAllTasksByProjectId } from '../../services/tasks.service';

export const useGetTasksByProjectId = (projectId: string) => {
  return useQuery({
    queryKey: getAllTasksByProjectIdQueryKey(projectId),
    queryFn: async () => await getAllTasksByProjectId(projectId),
    enabled: !!projectId,
  });
};
