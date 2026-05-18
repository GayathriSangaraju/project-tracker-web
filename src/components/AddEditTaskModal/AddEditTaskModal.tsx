import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { useCreateTask } from '../../hooks/tasks/useCreateTask';
import { useContext, useEffect, useState } from 'react';
import { ModalContext, ModalType } from '../../contexts/ModalContextProvider';
import { useUpdateTask } from '../../hooks/tasks/useUpdateTask';
import { useParams } from 'react-router';
import { useGetTaskById } from '../../hooks/tasks/useGetTaskById';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';
import { Loading } from '../Loading/Loading';

export const AddEditTaskModal = () => {
  const params = useParams();
  const projectId = params.id ?? '';
  const { modalState, closeModal } = useContext(ModalContext);
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
  const isSaving = createTaskMutation.isPending || updateTaskMutation.isPending;

  const { data: task, isLoading, isError } = useGetTaskById(projectId, taskId ?? '');

  const resetForm = () => {
    setTitle('');
    setIsCompleted(false);
    setError('');
    setMutationError('');
  };

  useEffect(() => {
    if (isTaskModalOpen && isEditMode && task) {
      setTitle(task.title);
      setIsCompleted(task.completed);
    }
    if (!isTaskModalOpen) {
      resetForm();
    }
  }, [task, isTaskModalOpen, isEditMode]);

  const handleSaveTask = async () => {
    const taskData = {
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
          await updateTaskMutation.mutateAsync({ taskId: taskId!, updateTaskData: taskData });
        } else {
          await createTaskMutation.mutateAsync(taskData);
        }
        closeModal(ModalType.AddEditTaskModal);
        resetForm();
      } catch (err) {
        setMutationError(err instanceof Error ? err.message : 'Failed to save task.');
      }
    }
  };

  const handleCancel = () => {
    closeModal(ModalType.AddEditTaskModal);
    resetForm();
  };

  return (
    <Dialog onClose={handleCancel} open={isTaskModalOpen} aria-labelledby="task-dialog-title">
      <DialogTitle id="task-dialog-title">{isEditMode ? 'Edit Task' : 'Add Task'}</DialogTitle>
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
              disabled={isSaving}
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
                  disabled={isSaving}
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
        <Button variant="outlined" onClick={handleCancel} disabled={isSaving} size="medium">
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={isSaving}
          onClick={handleSaveTask}
          size="medium"
          startIcon={isSaving ? <CircularProgress size={16} /> : undefined}
        >
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
