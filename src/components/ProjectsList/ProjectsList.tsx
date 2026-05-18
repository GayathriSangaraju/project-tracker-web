import { Link } from 'react-router';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { createColumnHelper } from '@tanstack/react-table';
import { Project } from '../../types/project';
import { useGetAllProjects } from '../../hooks/projects/useGetAllProjects';
import { formatDate } from '../../utils/formatDate';
import { useDeleteProject } from '../../hooks/projects/useDeleteProject';
import { useContext, useState } from 'react';
import { ModalContext, ModalType } from '../../contexts/ModalContextProvider';
import { ConfirmDialog } from '../ConfirmDialog/ConfirmDialog';
import { DataTable } from '../DataTable/DataTable';

export const ProjectsList = () => {
  const { data: projects, isLoading, isError } = useGetAllProjects();
  const columnHelper = createColumnHelper<Project>();
  const { openModal } = useContext(ModalContext);
  const deleteProjectMutation = useDeleteProject();
  const [showDeleteConfirmDialog, setShowDeleteConfirmDialog] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string>('');

  const handleDeleteProject = async () => {
    if (!deleteTargetId) return;
    await deleteProjectMutation.mutateAsync(deleteTargetId);
    setShowDeleteConfirmDialog(false);
    setDeleteTargetId('');
  };

  const handleEditProject = (projectId: string) => {
    openModal(ModalType.AddEditProjectModal, {
      isEditMode: true,
      projectId: projectId,
    });
  };

  const columns = [
    columnHelper.accessor('name', {
      cell: (info) => (
        <Link to={`/projects/${info?.row?.original?.id}`} style={{ color: 'inherit' }}>
          {info.getValue()}
        </Link>
      ),
      footer: (info) => info.column.id,
      header: () => 'Name',
      maxSize: 300,
      minSize: 180,
      size: 220,
    }),
    columnHelper.accessor('tasks', {
      cell: (info) => {
        const tasksCount = info.cell.getValue()?.length ?? 0;
        return <div>{tasksCount}</div>;
      },
      footer: (info) => info.column.id,
      header: () => 'Tasks Count',
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
      cell: (info) => (
        <Stack direction="row" spacing={1}>
          <IconButton
            aria-label={`Edit project ${info?.row?.original?.name}`}
            onClick={() => handleEditProject(info?.row?.original?.id)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            aria-label={`Delete project ${info?.row?.original?.name}`}
            disabled={deleteProjectMutation.isPending}
            onClick={() => {
              setDeleteTargetId(info?.row?.original?.id);
              setShowDeleteConfirmDialog(true);
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Stack>
      ),
      footer: (info) => info.column.id,
      header: () => 'Actions',
      minSize: 100,
    }),
  ];

  return (
    <div>
      <DataTable
        columns={columns}
        data={projects || []}
        isLoading={isLoading}
        isError={isError}
        errorMessage="An error occurred while fetching projects."
        emptyMessage='No projects yet. Click "Add Project" to get started.'
        ariaLabel="Projects table"
      />
      <ConfirmDialog
        open={showDeleteConfirmDialog}
        title="Delete Project"
        message="Are you sure you want to delete this project? This action cannot be undone."
        onConfirm={handleDeleteProject}
        onCancel={() => setShowDeleteConfirmDialog(false)}
      />
    </div>
  );
};
