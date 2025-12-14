import { useQuery } from '@tanstack/react-query';
import { getProjectByIdQueryKey } from '../../helpers/queryKeyHelper';
import { getProjectById } from '../../services/projects.service';

export const useGetProjectById = (id: string) => {
  return useQuery({
    queryKey: getProjectByIdQueryKey(id),
    queryFn: async () => await getProjectById(id),
    enabled: !!id,
    retry: false,
  });
};
