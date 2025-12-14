import { useParams } from 'react-router';
import { useGetProjectById } from '../../hooks/projects/useGetProjectById';
import { AddTaskFragment } from '../../components/AddTaskFragment/AddTaskFragment';
import { TasksList } from '../../components/TasksList/TasksList';
import { ErrorMessage } from '../../components/ErrorMessage/ErrorMessage';
import { formatDate } from '../../utils/formatDate';
import { Loading } from '../../components/Loading/Loading';

export const ProjectsDetailPage = () => {
  const params = useParams();
  const projectId = params.id;
  const { data, isLoading, isError, error } = useGetProjectById(projectId ?? '');
  return (
    <div>
      <h4>Projects Detail Page</h4>
      <div>
        {isLoading && <Loading />}
        {isError && <ErrorMessage message={error?.message} />}
        {!isLoading && data && (
          <>
            <div>Project Name: {data.name}</div>
            <div>Created At: {formatDate(data.created_at)}</div>
            <TasksList />
          </>
        )}
      </div>
      <AddTaskFragment isAddTaskDisabled={isError || isLoading} />
    </div>
  );
};
