import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import React, { useContext, useState } from 'react';
import { ModalContext, ModalType } from '../../contexts/ModalContextProvider';
import { useCreateProject } from '../../hooks/projects/useCreateProject';
import { useGetProjectById } from '../../hooks/projects/useGetProjectById';
import { useUpdateProject } from '../../hooks/projects/useUpdateProject';
import { Loading } from '../Loading/Loading';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';
import { PROJECT_DATA_FETCH_ERROR } from '../../constants/errorMessages';

export const AddEditProjectModal = () => {
  const { modalState, toggleModal } = useContext(ModalContext);
  const isProjectModalOpen = modalState.isAddProjectModalOpen;
  const modalPayload = modalState.payload;
  const isEditMode = modalPayload?.isEditMode ?? false;
  const projectId = modalPayload?.projectId ?? null;
  const { data: projectData, isLoading, isError } = useGetProjectById(projectId ?? '');
  const [projectName, setProjectName] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [mutationError, setMutationError] = useState<string>('');

  const handleCancel = () => {
    toggleModal({ type: ModalType.AddEditProjectModal });
    setProjectName('');
    setError('');
    setMutationError('');
  };

  React.useEffect(() => {
    if (projectData) setProjectName(projectData.name);
  }, [projectData]);

  const createProjectMutation = useCreateProject();
  const updateProjectMutation = useUpdateProject(projectId ?? '');

  const handleSaveProject = async () => {
    const project = {
      name: projectName,
    };
    if (!projectName.trim()) {
      setError('Name is required.');
    } else {
      setError('');
      setMutationError('');
      try {
        if (isEditMode) {
          await updateProjectMutation.mutateAsync(project);
        } else {
          await createProjectMutation.mutateAsync(project);
        }
        toggleModal({ type: ModalType.AddEditProjectModal });
        setProjectName('');
      } catch (err) {
        setMutationError(err instanceof Error ? err.message : 'Failed to save project.');
      }
    }
  };

  return (
    <Dialog onClose={handleCancel} open={isProjectModalOpen}>
      <DialogTitle>{isEditMode ? 'Edit Project' : 'Add Project'}</DialogTitle>
      <DialogContent>
        {isLoading && <Loading />}
        {isError && <ErrorMessage message={PROJECT_DATA_FETCH_ERROR} />}
        {mutationError && (
          <Alert severity="error" sx={{ mb: 1 }}>
            {mutationError}
          </Alert>
        )}
        <TextField
          label="Name"
          value={projectName}
          disabled={isLoading || isError}
          placeholder="Enter project name"
          required
          error={!!error}
          helperText={error}
          fullWidth
          margin="dense"
          onChange={(event) => {
            setProjectName(event.target.value);
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={handleCancel} size="medium">
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={isLoading || isError}
          onClick={handleSaveProject}
          size="medium"
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};
