import Link from '@mui/material/Link';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  flexRender,
} from '@tanstack/react-table';
import { Project } from '../../types/project';
import { useGetAllProjects } from '../../hooks/projects/useGetAllProjects';
import { formatDate } from '../../utils/formatDate';
import { useDeleteProject } from '../../hooks/projects/useDeleteProject';
import { useContext, useState } from 'react';
import { ModalContext, ModalType } from '../../contexts/ModalContextProvider';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';
import { ConfirmDialog } from '../ConfirmDialog/ConfirmDialog';

export const ProjectsList = () => {
  const { data: projects, isLoading, isError } = useGetAllProjects();
  const columnHelper = createColumnHelper<Project>();
  const { toggleModal } = useContext(ModalContext);
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
    toggleModal({
      type: ModalType.AddEditProjectModal,
      payload: {
        isEditMode: true,
        projectId: projectId,
      },
    });
  };

  const columns = [
    columnHelper.accessor('name', {
      cell: (info) => <Link href={`/projects/${info?.row?.original?.id}`}>{info.getValue()}</Link>,
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
          <IconButton aria-label="Edit" onClick={() => handleEditProject(info?.row?.original?.id)}>
            <EditIcon />
          </IconButton>
          <IconButton
            aria-label="Delete"
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

  const table = useReactTable({
    columnResizeMode: 'onChange',
    columns,
    data: projects || [],
    defaultColumn: {
      maxSize: 800,
      minSize: 80,
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  });

  return (
    <div>
      {isError && <ErrorMessage message={'An error occurred while fetching projects.'} />}
      {!isError && (
        <TableContainer component={Paper}>
          {isLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
              <CircularProgress />
            </div>
          ) : table.getRowModel().rows.length === 0 ? (
            <Typography sx={{ p: 3, textAlign: 'center' }} color="text.secondary">
              No projects yet. Click "Add Project" to get started.
            </Typography>
          ) : (
            <>
              <Table>
                <TableHead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableCell key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableHead>
                <TableBody>
                  {table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} hover>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TablePagination
                component="div"
                count={table.getFilteredRowModel().rows.length}
                page={table.getState().pagination.pageIndex}
                onPageChange={(_, page) => table.setPageIndex(page)}
                rowsPerPage={table.getState().pagination.pageSize}
                onRowsPerPageChange={(e) => table.setPageSize(Number(e.target.value))}
                rowsPerPageOptions={[5, 10, 25]}
              />
            </>
          )}
        </TableContainer>
      )}
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
