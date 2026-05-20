import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { createColumnHelper } from '@tanstack/react-table';
import { formatDate } from '../../utils/formatDate';
import { useGetTasksByProjectId } from '../../hooks/tasks/useGetTasksByProjectId';
import { useParams } from 'react-router';
import { Task } from '../../types/task';
import { useDeleteTask } from '../../hooks/tasks/useDeleteTask';
import { ModalContext, ModalType } from '../../contexts/ModalContextProvider';
import { useContext, useState } from 'react';
import { ConfirmDialog } from '../ConfirmDialog/ConfirmDialog';
import { DataTable } from '../DataTable/DataTable';
import Box from '@mui/material/Box';

export const TasksList = () => {
  const params = useParams();
  const { openModal } = useContext(ModalContext);
  const projectId = params.id ?? '';
  const { data: projectTasks, isLoading, isError } = useGetTasksByProjectId(projectId);
  const columnHelper = createColumnHelper<Task>();

  const deleteTaskMutation = useDeleteTask(projectId);
  const [showDeleteConfirmDialog, setShowDeleteConfirmDialog] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string>('');

  const handleDeleteTask = async () => {
    if (!deleteTargetId) return;
    await deleteTaskMutation.mutateAsync(deleteTargetId);
    setShowDeleteConfirmDialog(false);
    setDeleteTargetId('');
  };

  const handleEditTask = (taskId: string) => {
    openModal(ModalType.AddEditTaskModal, {
      isEditMode: true,
      taskId: taskId,
    });
  };

  const columns = [
    columnHelper.accessor('title', {
      cell: (info) => <div>{info.getValue()}</div>,
      footer: (info) => info.column.id,
      header: () => 'Title',
      maxSize: 300,
      minSize: 180,
      size: 220,
    }),
    columnHelper.accessor('completed', {
      cell: (info) => {
        return info.getValue() === true ? (
          <Chip label="Yes" color="success" size="small" />
        ) : (
          <Chip label="No" color="info" size="small" />
        );
      },
      footer: (info) => info.column.id,
      header: () => 'Completed',
      minSize: 80,
    }),
    columnHelper.accessor('created_at', {
      cell: (info) => formatDate(info.getValue()),
      footer: (info) => info.column.id,
      header: () => 'Created At',
      minSize: 400,
      size: 400,
    }),
    columnHelper.display({
      id: 'actions',
      cell: (info) => {
        const isCompleted = info.row.original.completed;
        return (
          <Stack direction="row" spacing={1}>
            <IconButton
              aria-label={`Edit task ${info?.row?.original?.title}`}
              disabled={isCompleted}
              onClick={() => handleEditTask(info?.row?.original?.id)}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              aria-label={`Delete task ${info?.row?.original?.title}`}
              disabled={deleteTaskMutation.isPending || isCompleted}
              onClick={() => {
                setDeleteTargetId(info?.row?.original?.id);
                setShowDeleteConfirmDialog(true);
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Stack>
        );
      },
      footer: (info) => info.column.id,
      header: () => 'Actions',
      minSize: 100,
    }),
  ];

  return (
    <Box component="section" aria-label="Tasks list">
      <DataTable
        columns={columns}
        data={projectTasks || []}
        isLoading={isLoading}
        isError={isError}
        errorMessage="An error occurred while fetching tasks."
        emptyMessage='No tasks yet. Click "Add task" to create one.'
        ariaLabel="Tasks table"
      />
      <ConfirmDialog
        open={showDeleteConfirmDialog}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        onConfirm={handleDeleteTask}
        onCancel={() => setShowDeleteConfirmDialog(false)}
      />
    </Box>
  );
};
