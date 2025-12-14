import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Alert from '@mui/material/Alert';
import { useCreateTask } from '../../hooks/tasks/useCreateTask';
import React, { useContext, useState } from 'react';
import { ModalContext, ModalType } from '../../contexts/ModalContextProvider';
import { useUpdateTask } from '../../hooks/tasks/useUpdateTask';
import { useParams } from 'react-router';
import { useGetTaskById } from '../../hooks/tasks/useGetTaskById';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';
import { Loading } from '../Loading/Loading';

export const AddEditTaskModal = () => {
  const params = useParams();
  const projectId = params.id ?? '';
  const { modalState, toggleModal } = useContext(ModalContext);
  const isTaskModalOpen = modalState.isAddTaskModalOpen;
  const modalPayload = modalState.payload;
  const isEditMode = modalPayload?.isEditMode ?? false;
  const taskId = modalPayload?.taskId ?? null;
  const [error, setError] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [mutationError, setMutationError] = useState<string>('');
  const createTaskMutation = useCreateTask(projectId);
  const updateTaskMutation = useUpdateTask(projectId);

  const { data: task, isLoading, isError } = useGetTaskById(projectId, taskId ?? '');

  React.useEffect(() => {
    if (task) {
      setTitle(task.title);
      setIsCompleted(task.completed);
    }
  }, [task]);

  const handleSaveTask = async () => {
    const task = {
      title,
      completed: isCompleted,
    };
    if (!title.trim()) {
      setError('Title is required.');
    } else {
      setError('');
      setMutationError('');
      try {
        if (isEditMode) {
          await updateTaskMutation.mutateAsync({ taskId: taskId!, updateTaskData: task });
        } else {
          await createTaskMutation.mutateAsync(task);
        }
        toggleModal({ type: ModalType.AddEditTaskModal });
        setTitle('');
      } catch (err) {
        setMutationError(err instanceof Error ? err.message : 'Failed to save task.');
      }
    }
  };
  const handleCancel = () => {
    toggleModal({ type: ModalType.AddEditTaskModal });
    setMutationError('');
  };

  return (
    <Dialog onClose={handleCancel} open={isTaskModalOpen}>
      <DialogTitle>{isEditMode ? 'Edit Task' : 'Add Task'}</DialogTitle>
      <DialogContent>
        {isLoading && <Loading />}
        {isError && <ErrorMessage message={'Error loading task data.'} />}
        {mutationError && (
          <Alert severity="error" sx={{ mb: 1 }}>
            {mutationError}
          </Alert>
        )}
        {!isLoading && !isError && (
          <>
            <TextField
              label="Title"
              value={title}
              placeholder="Enter task title"
              required
              error={!!error}
              helperText={error}
              fullWidth
              margin="dense"
              onChange={(event) => {
                setTitle(event.target.value);
              }}
            />
            <FormControlLabel
              label="Completed"
              control={
                <Switch
                  checked={isCompleted}
                  onChange={(event) => {
                    setIsCompleted(event.target.checked);
                  }}
                  inputProps={{ 'aria-label': 'Mark task as completed' }}
                />
              }
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={handleCancel} size="medium">
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSaveTask} size="medium">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};
