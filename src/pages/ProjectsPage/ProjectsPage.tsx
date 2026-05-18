import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { AddProjectFragment } from '../../components/AddProjectFragment/AddProjectFragment';
import { ProjectsList } from '../../components/ProjectsList/ProjectsList';

export const ProjectsPage = () => {
  return (
    <Stack spacing={2}>
      <Typography variant="h5" component="h2">
        Projects
      </Typography>
      <AddProjectFragment />
      <ProjectsList />
    </Stack>
  );
};
