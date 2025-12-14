import { useQuery } from '@tanstack/react-query';
import { getAllProjectsQueryKey } from '../../helpers/queryKeyHelper';
import { getAllProjects } from '../../services/projects.service';

export const useGetAllProjects = () => {
  return useQuery({
    queryKey: getAllProjectsQueryKey(),
    queryFn: async () => await getAllProjects(),
  });
};
