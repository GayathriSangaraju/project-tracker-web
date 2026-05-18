import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useParams } from 'react-router';
import { useGetProjectById } from '../../hooks/projects/useGetProjectById';
import { AddTaskFragment } from '../../components/AddTaskFragment/AddTaskFragment';
import { TasksList } from '../../components/TasksList/TasksList';
import { ErrorMessage } from '../../components/ErrorMessage/ErrorMessage';
import { formatDate } from '../../utils/formatDate';
import { Loading } from '../../components/Loading/Loading';

export const ProjectsDetailPage = () => {
  const params = useParams();
  const projectId = params.id ?? '';
  const { data, isLoading, isError, error } = useGetProjectById(projectId);

  if (!projectId) {
    return <ErrorMessage message="Project ID is missing." />;
  }

  return (
    <Box>
      <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
        Project Details
      </Typography>
      <Box>
        {isLoading && <Loading />}
        {isError && <ErrorMessage message={error?.message ?? 'Failed to load project.'} />}
        {!isLoading && data && (
          <>
            <Typography variant="body1" sx={{ mb: 0.5 }}>
              <strong>Project Name:</strong> {data.name}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              <strong>Created At:</strong> {formatDate(data.created_at)}
            </Typography>
            <TasksList />
          </>
        )}
      </Box>
      <AddTaskFragment isAddTaskDisabled={isError || isLoading} />
    </Box>
  );
};
